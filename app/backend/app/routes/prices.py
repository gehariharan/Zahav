from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.database import get_db
from app.models.price import PriceRecord, CurrencyRate
from app.utils.auth import get_current_admin_user

router = APIRouter(
    prefix="/prices",
    tags=["prices"],
    responses={401: {"description": "Unauthorized"}},
)


class PriceBase(BaseModel):
    metal_type: str
    purity: str
    currency: str
    bid_price: float
    ask_price: float
    day_high: Optional[float] = None
    day_low: Optional[float] = None


class PriceResponse(PriceBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True


class CurrencyRateBase(BaseModel):
    from_currency: str
    to_currency: str
    rate: float


class CurrencyRateResponse(CurrencyRateBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True


@router.get("/current", response_model=List[PriceResponse])
async def get_current_prices(
    metal_type: Optional[str] = None,
    currency: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get current (latest) prices."""
    query = db.query(PriceRecord)

    if metal_type:
        query = query.filter(PriceRecord.metal_type == metal_type)

    if currency:
        query = query.filter(PriceRecord.currency == currency)

    # Get the latest timestamp for each metal_type, purity, and currency combination
    subquery = (
        db.query(
            PriceRecord.metal_type,
            PriceRecord.purity,
            PriceRecord.currency,
            db.func.max(PriceRecord.timestamp).label("max_timestamp")
        )
        .group_by(PriceRecord.metal_type, PriceRecord.purity, PriceRecord.currency)
        .subquery()
    )

    latest_prices = (
        query.join(
            subquery,
            (PriceRecord.metal_type == subquery.c.metal_type)
            & (PriceRecord.purity == subquery.c.purity)
            & (PriceRecord.currency == subquery.c.currency)
            & (PriceRecord.timestamp == subquery.c.max_timestamp)
        )
        .all()
    )

    return latest_prices


@router.get("/historical", response_model=List[PriceResponse])
async def get_historical_prices(
    metal_type: str,
    purity: str,
    currency: str,
    start_date: datetime = Query(default=None),
    end_date: datetime = Query(default=None),
    db: Session = Depends(get_db),
):
    """Get historical prices for a specific metal, purity, and currency."""
    query = db.query(PriceRecord).filter(
        PriceRecord.metal_type == metal_type,
        PriceRecord.purity == purity,
        PriceRecord.currency == currency,
    )

    if start_date:
        query = query.filter(PriceRecord.timestamp >= start_date)

    if end_date:
        query = query.filter(PriceRecord.timestamp <= end_date)

    # Order by timestamp
    query = query.order_by(PriceRecord.timestamp.desc())

    prices = query.all()
    return prices


@router.post(
    "/", status_code=201, dependencies=[Depends(get_current_admin_user)]
)
async def create_price(
    price: PriceBase,
    db: Session = Depends(get_db),
):
    """Add new price record (admin only)."""
    new_price = PriceRecord(
        metal_type=price.metal_type,
        purity=price.purity,
        currency=price.currency,
        bid_price=price.bid_price,
        ask_price=price.ask_price,
        day_high=price.day_high,
        day_low=price.day_low,
    )

    db.add(new_price)
    db.commit()
    db.refresh(new_price)

    return {"id": new_price.id, "message": "Price record created successfully"}


@router.get("/currency-rates", response_model=List[CurrencyRateResponse])
async def get_currency_rates(
    from_currency: Optional[str] = None,
    to_currency: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get latest currency exchange rates."""
    query = db.query(CurrencyRate)

    if from_currency:
        query = query.filter(CurrencyRate.from_currency == from_currency)

    if to_currency:
        query = query.filter(CurrencyRate.to_currency == to_currency)

    # Get latest rates
    subquery = (
        db.query(
            CurrencyRate.from_currency,
            CurrencyRate.to_currency,
            db.func.max(CurrencyRate.timestamp).label("max_timestamp")
        )
        .group_by(CurrencyRate.from_currency, CurrencyRate.to_currency)
        .subquery()
    )

    latest_rates = (
        query.join(
            subquery,
            (CurrencyRate.from_currency == subquery.c.from_currency)
            & (CurrencyRate.to_currency == subquery.c.to_currency)
            & (CurrencyRate.timestamp == subquery.c.max_timestamp)
        )
        .all()
    )

    return latest_rates


@router.post(
    "/currency-rates", status_code=201, dependencies=[Depends(get_current_admin_user)]
)
async def create_currency_rate(
    rate: CurrencyRateBase,
    db: Session = Depends(get_db),
):
    """Add new currency rate (admin only)."""
    new_rate = CurrencyRate(
        from_currency=rate.from_currency,
        to_currency=rate.to_currency,
        rate=rate.rate,
    )

    db.add(new_rate)
    db.commit()
    db.refresh(new_rate)

    return {"id": new_rate.id, "message": "Currency rate created successfully"}

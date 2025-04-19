import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import '../styles/DealerTools.css';

const DealerTools = () => {
  const { authAxios } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Mock data for initial display
  const [currentPrices] = useState({
    gold: {
      bid: 62425,
      ask: 62625,
      spread: 200
    },
    silver: {
      bid: 78250,
      ask: 78450,
      spread: 200
    },
    platinum: {
      bid: 32500,
      ask: 32700,
      spread: 200
    },
    palladium: {
      bid: 28750,
      ask: 28950,
      spread: 200
    }
  });
  
  const [calculatorData, setCalculatorData] = useState({
    metal: 'gold',
    purity: '999',
    weight: '',
    unit: 'grams',
    priceType: 'ask'
  });
  
  const [calculationResult, setCalculationResult] = useState(null);

  const handleCalculatorChange = (e) => {
    const { name, value } = e.target;
    setCalculatorData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset calculation result when inputs change
    setCalculationResult(null);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    
    if (!calculatorData.weight || isNaN(calculatorData.weight) || parseFloat(calculatorData.weight) <= 0) {
      setError('Please enter a valid weight');
      return;
    }
    
    // Get base price from current prices
    const basePrice = currentPrices[calculatorData.metal][calculatorData.priceType];
    
    // Convert weight to grams if needed
    let weightInGrams = parseFloat(calculatorData.weight);
    if (calculatorData.unit === 'ounces') {
      weightInGrams = weightInGrams * 31.1035; // Troy ounce to grams
    } else if (calculatorData.unit === 'kilos') {
      weightInGrams = weightInGrams * 1000; // Kilos to grams
    }
    
    // Apply purity factor
    const purityFactor = parseInt(calculatorData.purity) / 999;
    
    // Calculate total value (for gold, price is per 10g in INR)
    let totalValue;
    if (calculatorData.metal === 'gold') {
      totalValue = (basePrice / 10) * weightInGrams * purityFactor;
    } else {
      totalValue = (basePrice / 1000) * weightInGrams * purityFactor; // Price per kg for other metals
    }
    
    setCalculationResult({
      metal: calculatorData.metal,
      purity: calculatorData.purity,
      weight: calculatorData.weight,
      unit: calculatorData.unit,
      priceType: calculatorData.priceType,
      basePrice,
      totalValue: Math.round(totalValue * 100) / 100
    });
    
    setError(null);
  };

  return (
    <div className="dealer-tools-page">
      <header className="page-header">
        <h1>Dealer Tools</h1>
        <p>Professional tools for bullion dealers</p>
      </header>

      {error && <Alert type="error" message={error} />}
      {successMessage && <Alert type="success" message={successMessage} />}

      <div className="tools-grid">
        <Card 
          title="Metal Value Calculator" 
          className="calculator-card"
        >
          <form onSubmit={handleCalculate}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="metal">Metal</label>
                <select 
                  id="metal" 
                  name="metal" 
                  value={calculatorData.metal} 
                  onChange={handleCalculatorChange}
                >
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="platinum">Platinum</option>
                  <option value="palladium">Palladium</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="purity">Purity</label>
                <select 
                  id="purity" 
                  name="purity" 
                  value={calculatorData.purity} 
                  onChange={handleCalculatorChange}
                >
                  <option value="999">999 Fine (24K)</option>
                  <option value="995">995 Fine (23.9K)</option>
                  <option value="916">916 (22K)</option>
                  <option value="750">750 (18K)</option>
                  <option value="585">585 (14K)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weight">Weight</label>
                <input 
                  type="number" 
                  id="weight" 
                  name="weight" 
                  value={calculatorData.weight} 
                  onChange={handleCalculatorChange}
                  min="0.001"
                  step="0.001"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <select 
                  id="unit" 
                  name="unit" 
                  value={calculatorData.unit} 
                  onChange={handleCalculatorChange}
                >
                  <option value="grams">Grams</option>
                  <option value="ounces">Troy Ounces</option>
                  <option value="kilos">Kilograms</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="priceType">Price Type</label>
              <select 
                id="priceType" 
                name="priceType" 
                value={calculatorData.priceType} 
                onChange={handleCalculatorChange}
              >
                <option value="bid">Bid (Selling to Dealer)</option>
                <option value="ask">Ask (Buying from Dealer)</option>
              </select>
            </div>

            <div className="form-actions">
              <Button 
                type="submit" 
                variant="primary" 
                loading={loading}
              >
                Calculate Value
              </Button>
            </div>
          </form>

          {calculationResult && (
            <div className="calculation-result">
              <h3>Calculation Result</h3>
              <div className="result-details">
                <div className="result-row">
                  <span className="result-label">Metal:</span>
                  <span className="result-value">
                    {calculationResult.metal.charAt(0).toUpperCase() + calculationResult.metal.slice(1)}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">Purity:</span>
                  <span className="result-value">{calculationResult.purity} Fine</span>
                </div>
                <div className="result-row">
                  <span className="result-label">Weight:</span>
                  <span className="result-value">
                    {calculationResult.weight} {calculationResult.unit}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">Base Price:</span>
                  <span className="result-value">
                    ₹ {calculationResult.basePrice.toLocaleString()} per {calculationResult.metal === 'gold' ? '10g' : 'kg'}
                  </span>
                </div>
                <div className="result-row total-value">
                  <span className="result-label">Total Value:</span>
                  <span className="result-value">
                    ₹ {calculationResult.totalValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card 
          title="Premium Calculator" 
          className="premium-calculator-card"
        >
          <div className="coming-soon">
            <p>Premium calculator coming soon</p>
            <p>Calculate premiums over spot prices for various products</p>
          </div>
        </Card>

        <Card 
          title="Margin Analysis" 
          className="margin-analysis-card"
        >
          <div className="coming-soon">
            <p>Margin analysis tool coming soon</p>
            <p>Analyze profit margins on different products and transactions</p>
          </div>
        </Card>

        <Card 
          title="Current Spreads" 
          className="spreads-card"
        >
          <div className="spreads-table">
            <div className="spreads-header">
              <div className="spreads-cell">Metal</div>
              <div className="spreads-cell">Bid (₹)</div>
              <div className="spreads-cell">Ask (₹)</div>
              <div className="spreads-cell">Spread (₹)</div>
            </div>
            {Object.entries(currentPrices).map(([metal, prices]) => (
              <div key={metal} className="spreads-row">
                <div className="spreads-cell metal-name">
                  {metal.charAt(0).toUpperCase() + metal.slice(1)}
                </div>
                <div className="spreads-cell">{prices.bid.toLocaleString()}</div>
                <div className="spreads-cell">{prices.ask.toLocaleString()}</div>
                <div className="spreads-cell">{prices.spread.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DealerTools;

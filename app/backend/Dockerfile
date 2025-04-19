FROM python:3.9-slim

WORKDIR /app

# Install Poetry
RUN pip install poetry==1.4.2

# Copy project definition files
COPY pyproject.toml poetry.lock* ./

# Configure Poetry to not use virtualenv
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-dev

# Copy application code
COPY . .

# Create SQLite database directory and set permissions if needed
RUN mkdir -p ./data && chmod -R 777 ./data

# Expose port
EXPOSE 8000

# Run application with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

FROM python:3.10-slim

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV CORS_ORIGIN=*

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]

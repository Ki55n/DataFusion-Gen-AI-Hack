# Use an official Python runtime as a parent image
FROM python:3.11

# Set the working directory in the container
WORKDIR /application

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the application code
COPY . /application

# Expose port 8000
EXPOSE 8000

# Command to run the FastAPI application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Use the official Python image from the Docker Hub
FROM python:3.12

# Set the working directory
WORKDIR /datafusion

# Copy the current directory contents into the container at /datafusion
COPY ./requirements.txt /datafusion/requirements.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r /datafusion/requirements.txt

# Update the package list
RUN apt-get update && apt-get upgrade -y

# Set the environment variable
ENV HOME=/datafusion 

WORKDIR $HOME

# Copy the application code
COPY . .

# Make the start.sh script executable
RUN python3 write_start_sh.py
RUN chmod +x start.sh

# Expose the necessary ports
EXPOSE 8000 8001

# Run the start.sh script
CMD [ "bash", "./start.sh" ]
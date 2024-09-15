# DataFusion-Gen-AI-Hack
DataFusion (See Deeper, Decide Smarter) is AI-Powered Data Analysis System ( Based on Prompt like Chat GPT) AI Chat, Generative Interactive Charts, Data Insights, Psychographic Analysis, AI Analyst, Speak and Explain Charts, and more.


## Backend code structure 
* [backend_dateja](https://github.com/DhruvAtreja/DataVisualization)
* sqlite_server

To run the code, make sure you have `.env` file and following credentials: 
GOOGLE_API_KEY=API_KEY
DB_ENDPOINT_URL=http://0.0.0.0:8000

Step 1: start the sqlite server:
* cd sqlite 
* `fastapi run routers.py --port 8000`
 
Step 2: run main.py in genai-ex-datafusion
* `fastapi run main.py --port 8001`

Step 3: Upload a csv file using apis listed in localhost:8000/docs

Step 4: copy the uuid and run query using apis in localhost:8001/docs
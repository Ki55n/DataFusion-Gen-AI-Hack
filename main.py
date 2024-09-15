from fastapi import FastAPI, HTTPException
import os, sys
from dotenv import load_dotenv
# from backend_dateja.my_agent.main import graph
from backend_dateja.my_agent.WorkflowManager import WorkflowManager

from pydantic import BaseModel

# Data model for the SQL query execution request
class QueryRequest(BaseModel):
    uuid: str
    query: str

app = FastAPI()

# load credentials
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
ENDPOINT_URL = os.getenv("DB_ENDPOINT_URL")

# for deployment on langgraph cloud
graph = WorkflowManager(api_key=API_KEY, endpoint_url=ENDPOINT_URL).returnGraph()

@app.post("/call-model")
async def call_model(request: QueryRequest):
    uuid = request.uuid
    query = request.query

    # Check if both uuid and query are provided
    if not uuid or not query:
        raise HTTPException(status_code=400, detail="Missing uuid or query")

    try:
        response = graph.invoke({"question": query, "uuid": uuid})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
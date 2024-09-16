from backend_dateja.sqlite import sqlite_router
from fastapi import FastAPI, HTTPException
import os, sys
from dotenv import load_dotenv

# from backend_dateja.my_agent.main import graph
from backend_dateja.my_agent.WorkflowManager import WorkflowManager
from backend_dateja.receptionist.assistant import VirtualAssistant
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

# define csv_agent_graph
csv_agent_graph = WorkflowManager(api_key=API_KEY, endpoint_url=ENDPOINT_URL).returnGraph()

# define receptionist_agent
assistant = VirtualAssistant(api_key=API_KEY)
receptionist_agent = assistant.get_agent()

@app.post("/csv-agent/call-model")
async def call_csv_agent(request: QueryRequest):
    uuid = request.uuid
    query = request.query

    # Check if both uuid and query are provided
    if not uuid or not query:
        raise HTTPException(status_code=400, detail="Missing uuid or query")

    try:
        response = csv_agent_graph.invoke({"question": query, "uuid": uuid})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    return response

@app.post("/receptionist-agent/call-model")
async def call_receptionist_agent(query: str):
    # Check if both uuid and query are provided
    if not query:
        raise HTTPException(status_code=400, detail="Missing query")

    try:
        response = receptionist_agent.invoke(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    return response


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)

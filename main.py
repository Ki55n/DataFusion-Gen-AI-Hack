import logging
import os
import sqlite3

import httpx
import pandas as pd
from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from backend_dateja.analysis import AdvancedVisualizer
from backend_dateja.cleaning import AdvancedDataPipeline

# from backend_dateja.my_agent.main import graph
from backend_dateja.my_agent.WorkflowManager import WorkflowManager
from backend_dateja.my_agent.LLMManager import LLMManager

logger = logging.getLogger(__name__)


# Data model for the SQL query execution request
class QueryRequest(BaseModel):
    project_uuid: str
    file_uuids: List[str]
    question: str


class CleaningRequest(BaseModel):
    file_uuid: str
    action: str  # options: handle_inconsistent_formats, handle_missing_values, handle_duplicates, handle_high_dimensionality


class AnalysisRequest(BaseModel):
    file_uuid: str
    action: str  # options: basic_insights, insights,


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load credentials
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
ENDPOINT_URL = os.getenv("DB_ENDPOINT_URL")
CLEANED_TABLE_NAME = "data_cleaned"
ANALYSED_TABLE_NAME = "data_analysed"
# define csv_agent_graph
csv_agent_graph = WorkflowManager(
    api_key=API_KEY, endpoint_url=ENDPOINT_URL
).returnGraph()

# define summarizer llm agent
summarizer_llm = LLMManager(api_key=API_KEY)

def table_exists(conn, table_name):
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name=?;
    """,
        (table_name,),
    )
    return cursor.fetchone() is None


@app.post("/call-model")
async def call_model(request: QueryRequest):
    project_uuid = request.project_uuid
    file_uuids = request.file_uuids
    question = request.question

    # Check if both uuid and query are provided
    if not file_uuids or not question or not project_uuid:
        raise HTTPException(status_code=400, detail="Missing uuids or query")
    try:
        async with httpx.AsyncClient() as client:
            uploads_dir = await client.get(f"{ENDPOINT_URL}/get-uploads-dir")
            uploads_dir = uploads_dir.json()

        for id in file_uuids:
            # Connect to SQLite and save the cleaned data
            db_file_path = os.path.join(uploads_dir, f"{id}.sqlite")
            table_name = CLEANED_TABLE_NAME
            conn = sqlite3.connect(db_file_path)

            if table_exists(conn=conn, table_name=table_name):
                conn.close()
                raise HTTPException(
                    status_code=404,
                    detail=f"Table '{table_name}' does not exist in the database",
                )
            else:
                conn.close()
        response = csv_agent_graph.invoke(request)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

    return response


@app.post("/data-cleaning-pipeline")
async def data_cleaning_pipeline(file_uuid: str):
    try:
        async with httpx.AsyncClient() as client:
            # from other application in port 8000
            response = await client.get(
                f"{ENDPOINT_URL}/get-file-dataframe/{file_uuid}"
            )

            uploads_dir = await client.get(f"{ENDPOINT_URL}/get-uploads-dir")
            uploads_dir = uploads_dir.json()
            df = pd.read_json(response.json())

        pipeline = AdvancedDataPipeline(df)
        cleaned_df = pipeline.run_all()[0]

        # Connect to SQLite and save the cleaned data
        db_path = os.path.join(uploads_dir, f"{file_uuid}.sqlite")

        conn = sqlite3.connect(db_path)
        try:
            cleaned_df.to_sql(
                CLEANED_TABLE_NAME, conn, if_exists="replace", index=False
            )
            return {"message": "Finished data cleaning."}
        except Exception as e:
            logger.exception("Error saving data to SQLite.")
            raise HTTPException(
                status_code=500, detail=f"Failed to save cleaned data: {str(e)}"
            )
        finally:
            conn.close()

    except Exception as e:
        logger.exception("Error during the data cleaning pipeline.")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/data-analysis-pipeline")
async def handle_data_analysis(file_uuid: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{ENDPOINT_URL}/get-file-dataframe/{file_uuid}"
            )
            df = pd.read_json(response.json())
            uploads_dir = await client.get(f"{ENDPOINT_URL}/get-uploads-dir")
            uploads_dir = uploads_dir.json()

        visualizer = AdvancedVisualizer(df, api_key=API_KEY)
        markdown_response = visualizer.handle_request("generate_report")
        # Connect to SQLite and save the cleaned data
        db_path = os.path.join(uploads_dir, f"{file_uuid}.sqlite")

        try:
            # Connect to (or create) the SQLite database
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()

            # Create a table for storing Markdown content
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS {ANALYSED_TABLE_NAME} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    report_name TEXT NOT NULL,
                    markdown_content TEXT NOT NULL
                )
            """)

            # Insert Markdown content into the table
            cursor.execute(
                f"""
                INSERT INTO {ANALYSED_TABLE_NAME} (report_name, markdown_content) 
                VALUES (?, ?)
            """,
                ("Data Insights", markdown_response),
            )

            # Commit and close the connection
            conn.commit()
            return {"message": "Finished data analysis."}
        except Exception as e:
            logger.exception("Error saving data to SQLite.")
            raise HTTPException(
                status_code=500, detail=f"Failed to save analyzed data: {str(e)}"
            )
        finally:
            conn.close()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# import base64
# def image_to_base64(image_path):
#     with open(image_path, "rb") as image_file:
#         return base64.b64encode(image_file.read()).decode('utf-8')


@app.post("/summarize-vis")
async def summarize_visualization(vis_data: dict = {}):
    """Summarize input vis data and image."""
    # image_base64 = image_to_base64(image_path)
    system_template = """You are an expert data analyst and visualization interpreter. Your task is to summarize a data visualization based on the raw visualization data, visualizaiton type, and the description of the visualization. 
    Provide a clear, concise summary that captures the key insights and trends. Your summary should be suitable for being read aloud to a user.

    Follow these guidelines:
    1. Analyze the data to ensure a comprehensive understanding.
    2. Focus on the most important trends, patterns, or insights from the data.
    3. Mention any discrepancies between the visualization and the raw data, if any.
    4. Keep the language clear and accessible, avoiding overly technical terms.
    5. Limit the summary to about 3-5 sentences for easy listening.
    6. End with a key takeaway or main point of the visualization.

    Remember, the user will hear this summary, so make it easy to follow and understand when spoken aloud."""

    human_template = f"""Visualization Data (JSON format):
    {{vis_data}}

    Please summarize this visualization, focusing on the key insights and trends, in a way that can be easily understood when read aloud."""

    # image_template = f"![fruit_image](data:image/jpeg;base64,{image_base64})"

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_template),
        ("human", human_template),
        # ("human", image_template),
    ])

    response = summarizer_llm.llm.invoke(prompt.format_messages(vis_data=vis_data))
    return {"summary": response.content}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)

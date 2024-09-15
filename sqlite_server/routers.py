import os
import shutil
import uuid
import sqlite3
import pandas as pd
from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Create FastAPI router
# router = APIRouter()
router = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Create the uploads directory if it doesn't exist

# Helper function to convert CSV to SQLite
def convert_csv_to_sqlite(csv_file_path: str, sqlite_file_path: str):
    try:
        # Read the CSV into a pandas DataFrame
        df = pd.read_csv(csv_file_path)
        
        # Write DataFrame to SQLite database
        with sqlite3.connect(sqlite_file_path) as conn:
            df.to_sql("data", conn, if_exists="replace", index=False)
    except Exception as e:
        raise RuntimeError(f"Error converting CSV to SQLite: {str(e)}")

@router.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Check if the file is uploaded
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        # Generate a UUID for the file
        file_uuid = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1].lower()
        new_file_path = None

        # Handle .sqlite file
        if file_extension == ".sqlite":
            new_file_path = os.path.join(UPLOAD_DIR, f"{file_uuid}.sqlite")
            # Save the uploaded file to the new path
            with open(new_file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

        # Handle .csv file
        elif file_extension == ".csv":
            csv_file_path = os.path.join(UPLOAD_DIR, file.filename)
            new_file_path = os.path.join(UPLOAD_DIR, f"{file_uuid}.sqlite")

            # Save the CSV temporarily
            with open(csv_file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Convert CSV to SQLite
            try:
                convert_csv_to_sqlite(csv_file_path, new_file_path)
                os.remove(csv_file_path)  # Remove the CSV file after conversion
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error converting CSV to SQLite: {str(e)}")

        else:
            raise HTTPException(status_code=400, detail="Invalid file type. Only .sqlite and .csv files are supported.")

        # Return the UUID of the uploaded file
        return JSONResponse(content={"uuid": file_uuid})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

UPLOAD_DIR = "uploads"

# Data model for the SQL query execution request
class QueryRequest(BaseModel):
    uuid: str
    query: str

# Endpoint for executing SQL queries on uploaded databases
@router.post("/execute-query")
async def execute_query(request: QueryRequest):
    uuid = request.uuid
    query = request.query

    # Check if both uuid and query are provided
    if not uuid or not query:
        raise HTTPException(status_code=400, detail="Missing uuid or query")

    db_path = os.path.join(UPLOAD_DIR, f"{uuid}.sqlite")

    # Check if the database file exists
    if not os.path.exists(db_path):
        raise HTTPException(status_code=404, detail="Database not found")

    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Execute the SQL query
        cursor.execute(query)
        results = cursor.fetchall()

        # Convert the results to JSON-friendly format
        result_list = [list(row) for row in results]
        return JSONResponse(content={"results": result_list})
    except sqlite3.Error as e:
        raise HTTPException(status_code=400, detail=f"SQL error: {e}")
    finally:
        cursor.close()
        conn.close()

# Endpoint for retrieving the schema of the database
@router.get("/get-schema/{uuid}")
async def get_schema(uuid: str):
    # Check if uuid is provided
    if not uuid:
        raise HTTPException(status_code=400, detail="Missing uuid")

    db_path = os.path.join(UPLOAD_DIR, f"{uuid}.sqlite")

    # Check if the database file exists
    if not os.path.exists(db_path):
        raise HTTPException(status_code=404, detail="Database not found")

    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Get the table schema from sqlite_master
        cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()

        schema = []

        # Function to process each table and fetch its schema and example rows
        for table in tables:
            table_name, create_statement = table
            schema.append(f"Table: {table_name}")
            schema.append(f"CREATE statement: {create_statement}\n")

            # Fetch example rows from the table (up to 3 rows)
            cursor.execute(f"SELECT * FROM '{table_name}' LIMIT 3;")
            rows = cursor.fetchall()
            if rows:
                schema.append("Example rows:")
                for row in rows:
                    schema.append(str(row))
            schema.append("")  # Blank line between tables

        # Return the schema as a single response
        return JSONResponse(content={"schema": "\n".join(schema)})

    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving schema: {e}")
    finally:
        cursor.close()
        conn.close()

# Basic hello world endpoint
@router.get("/")
async def root():
    return {"message": "Hello World"}


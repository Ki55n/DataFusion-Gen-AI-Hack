import os
import shutil
import sqlite3
import uuid
from io import BytesIO
import markdown2
from weasyprint import HTML

import pandas as pd
from typing import List
from fastapi import APIRouter, FastAPI, File, HTTPException, UploadFile, Query
from fastapi.responses import JSONResponse
# from metadata_store import query_metadata, store_metadata
from pydantic import BaseModel
from io import StringIO
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI router
router = FastAPI()

router.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
CLEANED_TABLE_NAME = "data_cleaned"
ANALYSED_TABLE_NAME = "data_analysed"
os.makedirs(
    UPLOAD_DIR, exist_ok=True
)  # Create the uploads directory if it doesn't exist


# Data model for the SQL query execution request
class QueryRequest(BaseModel):
    file_uuid: str
    query: str


# Helper function to convert CSV to SQLite
def convert_dataframe_to_sqlite(df, sqlite_file_path: str):
    try:
        # Write DataFrame to SQLite database
        with sqlite3.connect(sqlite_file_path) as conn:
            df.to_sql("data", conn, if_exists="replace", index=False)
    except Exception as e:
        raise RuntimeError(f"Error converting CSV to SQLite: {str(e)}")

def table_exists(conn, table_name):
    cursor = conn.cursor()
    cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    has_cleaned_table = False
    for table in tables:
        table_name, create_statement = table
        if table_name in table_name:
            has_cleaned_table = True

    if has_cleaned_table is False:
        raise HTTPException(status_code=404, detail=f"Cleaned Table does not exist in the database")
    
    return True

@router.post("/upload-file", description="Allowed file formats: csv, xls, xlsx, sqlite ")
async def upload_file(
    file: UploadFile = File(...)
):
    # Check if both uuid and query are provided
    if not file:
        raise HTTPException(status_code=400, detail="Missing uuids or file")
    allowed_formats = ["csv", "xls", "xlsx", "sqlite"]
    file_extension = os.path.splitext(file.filename)[1][1:].lower()

    if file_extension not in allowed_formats:
        raise HTTPException(status_code=400, detail=f"Invalid file format. Allowed formats are: {', '.join(allowed_formats)}")
    
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
                df = pd.read_csv(csv_file_path)
                convert_dataframe_to_sqlite(df, new_file_path)
                os.remove(csv_file_path)  # Remove the CSV file after conversion
            except Exception as e:
                raise HTTPException(
                    status_code=500, detail=f"Error converting CSV to SQLite: {str(e)}"
                )
        # Handle .xls and .xlsx files
        elif file_extension in [".xls", ".xlsx"]:
            excel_file_path = os.path.join(UPLOAD_DIR, file.filename)
            new_file_path = os.path.join(UPLOAD_DIR, f"{file_uuid}.sqlite")

            # Save the Excel file temporarily
            with open(excel_file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Convert Excel to SQLite
            try:
                df = pd.read_excel(excel_file_path)
                convert_dataframe_to_sqlite(df, new_file_path)
                os.remove(excel_file_path)  # Remove the Excel file after conversion
            except Exception as e:
                raise HTTPException(
                    status_code=500, detail=f"Error converting Excel to SQLite: {str(e)}"
                )
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only .sqlite and .csv files are supported.",
            )

        # Store metadata in the metadata SQLite database
        # store_metadata(file_uuid, project_uuid, user_uuid, UPLOAD_DIR, new_file_path)
        # Return the UUID of the uploaded file
        return JSONResponse(content={"file_uuid": file_uuid})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Endpoint for retrieving the schema of the database
@router.get("/get-uploads-dir")
async def get_uploads_dir():
    
    if os.path.exists(UPLOAD_DIR):
        return os.path.abspath(UPLOAD_DIR)

    return "Uploads directory doesn't exists."

async def get_table_as_csv(file_uuid: str, table_name: str):
    upload_dir = await get_uploads_dir()
    # Connect to the SQLite database
    db_file_path = os.path.join(upload_dir, f"{file_uuid}.sqlite")
    conn = sqlite3.connect(db_file_path)
    
    try:
        # Query the table data into a pandas dataframe
        table_exists(conn=conn, table_name=table_name)
        df = pd.read_sql_query(f"SELECT * FROM {table_name}", conn)
        
        # Use StringIO to hold CSV data in memory
        csv_buffer = StringIO()
        df.to_csv(csv_buffer, index=False)
        
        # Reset the pointer of the buffer to the beginning
        csv_buffer.seek(0)
        
        return csv_buffer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting table {table_name}: {str(e)}")
    finally:
        # Always close the database connection
        conn.close()

@router.get("/download_cleaned_data/{file_uuid}")
async def download_tables_as_csv(file_uuid: str):
    
    try:
        data_cleaned_csv = await get_table_as_csv(file_uuid, CLEANED_TABLE_NAME)
        
        # Stream the cleaned data CSV back as a response
        return StreamingResponse(data_cleaned_csv, media_type="text/csv", headers={
            "Content-Disposition": f"attachment; filename={file_uuid}_{CLEANED_TABLE_NAME}.csv"
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to download CSV: {str(e)}")


@router.get("/download_data_analysis/{file_uuid}")
async def download_data_insights_as_pdf(file_uuid: str):
    
    try:
        upload_dir = await get_uploads_dir()
        # Connect to the SQLite database
        db_file_path = os.path.join(upload_dir, f"{file_uuid}.sqlite")
        conn = sqlite3.connect(db_file_path)

        # Query the table data into a pandas dataframe
        table_exists(conn=conn, table_name=ANALYSED_TABLE_NAME)
        df = pd.read_sql_query(f"SELECT * FROM {ANALYSED_TABLE_NAME}", conn)
        print(df)
    
        # Convert markdown to HTML
        html_content = markdown2.markdown(df["markdown_content"].iloc[0])
        
        # Add some basic styling
        styled_html = f"""
        <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }}
                    h1, h2, h3 {{ color: #333; }}
                    table {{ border-collapse: collapse; width: 100%; }}
                    th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                    th {{ background-color: #f2f2f2; }}
                </style>
            </head>
            <body>
                {html_content}
            </body>
        </html>
        """
        
        # Convert HTML to PDF
        pdf_buffer = BytesIO()
        HTML(string=styled_html).write_pdf(pdf_buffer)
        pdf_buffer.seek(0)
        
        # Return PDF as a downloadable file
        return StreamingResponse(
            pdf_buffer, 
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={file_uuid}_{ANALYSED_TABLE_NAME}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
# Endpoint for executing SQL queries on uploaded databases
@router.post("/execute-query")
async def execute_query(request: QueryRequest):
    file_uuid = request.file_uuid
    query = request.query

    # Check if both uuid and query are provided
    if not file_uuid or not query:
        raise HTTPException(status_code=400, detail="Missing uuid or query")

    db_path = os.path.join(UPLOAD_DIR, f"{file_uuid}.sqlite")

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
        table_exists(conn=conn, table_name=CLEANED_TABLE_NAME)
        cursor = conn.cursor()

        # Get the table schema from sqlite_master
        cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()

        schema = []

        # Function to process each table and fetch its schema and example rows
        for table in tables:
            table_name, create_statement = table
            if CLEANED_TABLE_NAME in table_name:
                schema.append(f"Table: {table_name}")
                schema.append(f"CREATE statement: {create_statement}\n")

                # Fetch only 5 rows from the table as this is an example schema for model to generate sql query
                cursor.execute(f"SELECT * FROM '{table_name}' LIMIT 10;")
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

# Endpoint for retrieving the schema of the database
@router.get("/get-schemas")
async def get_schemas(file_uuids:  List[str] = Query(..., description="List of file UUIDs"), project_uuid: str = "test"):
    # Check if uuid is provided
    if not file_uuids:
        raise HTTPException(status_code=400, detail="Missing uuid")

    try:
        await create_multi_file_dataframe(file_uuids=file_uuids, project_uuid=project_uuid)
        return await get_schema(uuid=project_uuid)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")



# Basic hello world endpoint
@router.get("/")
async def root():
    return {"message": "This is a sqlite-server"}


# @router.get("/get-file-metadata/{file_uuid}")
# async def get_file_metadata(file_uuid: str):
#     try:
#         # Query metadata from the metadata SQLite database
#         result: dict = query_metadata(file_uuid, UPLOAD_DIR)

#         if not result:
#             raise HTTPException(status_code=404, detail="File metadata not found")

#         return JSONResponse(content=result)

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/get-file-dataframe/{file_uuid}")
async def get_file_dataframe(file_uuid: str, table_name: str = 'data'):
    db_path = os.path.join(UPLOAD_DIR, f"{file_uuid}.sqlite")

    # Check if the database file exists
    if not os.path.exists(db_path):
        raise HTTPException(status_code=404, detail="Database not found")

    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_path)

        # Read the database into a pandas DataFrame
        df = pd.read_sql_query(f"SELECT * FROM {table_name};", conn)

        # Convert the DataFrame to JSON
        df_json = df.to_json(orient="records")

        return JSONResponse(content=df_json)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        conn.close()


# @router.get("/create-multi-file-dataframe/{project_uuid}")
async def create_multi_file_dataframe(file_uuids: list[str], project_uuid: str = None):
    """
    This function creates a dataframe for a project from its csv files.
    Arguments:
    :project_uuids: uuid of the selected project
    :file_uuids: list of all uuids belonging to the given project
    """
    # Create a new merged database
    merged_db_name = os.path.join(UPLOAD_DIR, f"{project_uuid}.sqlite")

    # Check if the file already exists, and if so, delete it
    if os.path.exists(merged_db_name):
        os.remove(merged_db_name)

    merged_conn = sqlite3.connect(merged_db_name)

    for i, file_uuid in enumerate(file_uuids):
        source_file = os.path.join(UPLOAD_DIR, f"{file_uuid}.sqlite")
        if os.path.exists(source_file) is False:
            continue
        # Connect to the source database
        source_conn = sqlite3.connect(source_file)
        source_cursor = source_conn.cursor()
        
        # Get all table names from the source database
        source_cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = source_cursor.fetchall()
        
        for table in tables:
            source_table_name = table[0]
            if CLEANED_TABLE_NAME in source_table_name:
                # Read data from the source table
                source_cursor.execute(f"SELECT * FROM {source_table_name}")
                data = source_cursor.fetchall()
                
                # Get column names
                source_cursor.execute(f"PRAGMA table_info({source_table_name})")
                # columns = [column[1] for column in source_cursor.fetchall()]
                columns_info = source_cursor.fetchall()
                
                # Create the table in the merged database
                # columns_definition = ', '.join([f'"{col}" TEXT' for col in columns])
                columns_definition = ', '.join([f'"{column[1]}" {column[2]}' for column in columns_info])
                merged_conn.execute(f"CREATE TABLE IF NOT EXISTS {source_table_name+str(i)} ({columns_definition})")
                
                # Insert data into the merged database
                placeholders = ', '.join(['?' for _ in columns_info])
                merged_conn.executemany(f"INSERT INTO {source_table_name+str(i)} VALUES ({placeholders})", data)
            
        # Close the source connection
        source_conn.close()

    # Commit changes and close the merged connection
    merged_conn.commit()
    merged_conn.close()
    return f"Project db saved to: {UPLOAD_DIR}"

import os
import sqlite3

def store_metadata(
    file_uuid: str, project_uuid: str, user_uuid: str, upload_dir: str, file_path: str
):
    file_size = os.path.getsize(file_path)
    file_name = os.path.basename(file_path)
    metadata_db_path = os.path.join(upload_dir, "metadata.sqlite")

    with sqlite3.connect(metadata_db_path) as conn:
        cursor = conn.cursor()

        # Create table if it doesn't exist
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS file_metadata (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_uuid TEXT NOT NULL,
                project_uuid TEXT,
                user_uuid TEXT,
                file_name TEXT,
                file_size INTEGER
            )
            """
        )

        # Insert or replace metadata
        cursor.execute(
            """
            INSERT OR REPLACE INTO file_metadata (file_uuid, project_uuid, user_uuid, file_name, file_size)
            VALUES (?, ?, ?, ?, ?)
        """,
            (file_uuid, project_uuid, user_uuid, file_name, file_size),
        )

        conn.commit()


def query_metadata(file_uuid: str, upload_dir: str):
    metadata_db_path = os.path.join(upload_dir, "metadata.sqlite")

    with sqlite3.connect(metadata_db_path) as conn:
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT project_uuid, user_uuid, file_name, file_size FROM file_metadata
            WHERE file_uuid = ?
        """,
            (file_uuid,),
        )

        result = cursor.fetchone()
        file_path = os.path.join(upload_dir, f"{file_uuid}.sqlite")
        project_uuid, user_uuid, file_name, file_size = result

    with sqlite3.connect(file_path) as conn:
        cursor = conn.cursor()
        # fetch n_rows from the file
        cursor.execute("SELECT COUNT(*) FROM data;")
        row_count = cursor.fetchone()[0]

        # fetch columns list
        cursor.execute("PRAGMA table_info(data);")
        columns = cursor.fetchall()

    result = {
        "file_uuid": file_uuid,
        "project_uuid": project_uuid,
        "user_uuid": user_uuid,
        "file_name": file_name,
        "file_size": file_size,
        "row_count": row_count,
        "columns": [column[1] for column in columns],
    }

    return result

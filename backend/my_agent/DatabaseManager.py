import requests
import os
from typing import List, Any
from urllib.parse import urlencode

class DatabaseManager:
    def __init__(self, endpoint_url):
        self.endpoint_url = endpoint_url #os.getenv("DB_ENDPOINT_URL")

    def get_schema(self, uuid: str) -> str:
        """Retrieve the database schema."""
        try:
            response = requests.get(
                f"{self.endpoint_url}/get-schema/{uuid}"
            )
            response.raise_for_status()
            return response.json()['schema']
        except requests.RequestException as e:
            raise Exception(f"Error fetching schema: {str(e)}")
        
    def get_schemas(self, uuids: List[str], project_uuid: str) -> str:
        """Retrieve the database schema."""
        try:
            # Prepare the query parameters
            params = [('file_uuids', uuid) for uuid in uuids]
            params.append(('project_uuid', project_uuid))
            query_string = urlencode(params)

            # Make the GET request
            response = requests.get(
                f"{self.endpoint_url}/get-schemas?{query_string}"
            )
            response.raise_for_status()
            return response.json()['schema']
        except requests.RequestException as e:
            raise Exception(f"Error fetching schema: {str(e)}")

    def execute_query(self, file_uuid: str, query: str) -> List[Any]:
        """Execute SQL query on the remote database and return results."""
        try:
            response = requests.post(
                f"{self.endpoint_url}/execute-query",
                json={"file_uuid": file_uuid, "query": query}
            )
            response.raise_for_status()
            return response.json()['results']
        except requests.RequestException as e:
            raise Exception(f"Error executing query: {str(e)}")
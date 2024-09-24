from typing import List, Any, Annotated, Dict
from typing_extensions import TypedDict
import operator

class InputState(TypedDict):
    question: str
    file_uuid: List[str]
    parsed_question: Dict[str, Any]
    project_uuid: str
    unique_nouns: List[str]
    sql_query: str
    results: List[Any]
    visualization: Annotated[str, operator.add]

class OutputState(TypedDict):
    parsed_question: Dict[str, Any]
    unique_nouns: List[str]
    project_uuid: str
    sql_query: str
    sql_valid: bool
    sql_issues: str
    results: List[Any]
    answer: Annotated[str, operator.add]
    error: str
    visualization: Annotated[str, operator.add]
    visualization_reason: Annotated[str, operator.add]
    formatted_data_for_visualization: Dict[str, Any]
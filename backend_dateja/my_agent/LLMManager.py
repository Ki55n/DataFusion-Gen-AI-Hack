from langchain_core.prompts import ChatPromptTemplate
# from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAI

class LLMManager:
    def __init__(self, api_key):
        model_name = "gemini-1.5-flash"
        temperature = 0.0
        verbose = True

        # Create an OpenAI object.
        self.llm = ChatGoogleGenerativeAI(model=model_name, 
                                google_api_key=api_key, 
                                temperature=temperature, 
                                verbose=verbose)

    def invoke(self, prompt: ChatPromptTemplate, **kwargs) -> str:
        messages = prompt.format_messages(**kwargs)
        response = self.llm.invoke(messages)
        return response.content
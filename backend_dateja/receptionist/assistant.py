import json

from langchain.tools import WikipediaQueryRun
from langchain.utilities import WikipediaAPIWrapper
from langchain_community.tools import YouTubeSearchTool
from langchain.agents import initialize_agent, Tool
from langchain.agents.agent_types import AgentType
from langchain_core.prompts import ChatPromptTemplate

from backend_dateja.my_agent.LLMManager import LLMManager
from backend_dateja.receptionist.helper_funcs import fix_json

def extract_content(message):
    message = fix_json(message)
    return json.loads(message)

class VirtualAssistant:
    def __init__(self, api_key):
        self.api_key = api_key
        self.llm_manager = LLMManager(api_key=api_key)
        self.tools = []
        self.setup_tools() # initialize tools

    def setup_tools(self):
        # Add initial tools like Wikipedia and YouTube
        wikipedia = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())
        youtube = YouTubeSearchTool()
        wikipedia_tool = Tool(
                name="Wikipedia",
                func=wikipedia.run,
                description="Useful for querying Wikipedia for information",
                llm=self.llm_manager.llm
            )
        
        youtube_tool = Tool(
                name="YouTube Search",
                func=youtube.run,
                description="Useful for searching YouTube videos",
                llm=self.llm_manager.llm
            )
        self.add_tool(wikipedia_tool)
        self.add_tool(youtube_tool)

    def add_tool(self, tool: Tool):
        """Adds a tool to the assistant's toolkit."""
        self.tools.append(tool)

    def render_text_description(self, tools):
        return "\n".join([f"{tool.name}: {tool.description}" for tool in tools])

    def get_chat_prompt(self):
        rendered_tools = self.render_text_description(self.tools)

        system_prompt = f"""You are an assistant that has access to the following set of tools.
        Here are the names and descriptions for each tool:

        {rendered_tools}
        Given the user input, return the name and input of the tool to use.
        Return your response as a JSON blob with 'name' and 'arguments' keys.
        The value associated with the 'arguments' key should be a dictionary of parameters."""
        prompt = ChatPromptTemplate.from_messages(
            [("system", system_prompt), ("user", "{input}")]
        )

        return prompt
    
    def get_agent(self):
        prompt = self.get_chat_prompt()
        receptionist_agent = initialize_agent(tools=self.tools, 
                                              llm=self.llm_manager.llm, 
                                              agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, 
                                              verbose=True, 
                                              agent_kwargs={"prompt":prompt})
        return receptionist_agent
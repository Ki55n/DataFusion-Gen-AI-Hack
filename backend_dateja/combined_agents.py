from typing import Dict, Any
from langchain.agents import AgentExecutor, ZeroShotAgent
from langchain.agents.agent_types import AgentType
from langchain.chains import LLMChain
from langchain.agents import Tool, initialize_agent
from langchain_core.prompts import ChatPromptTemplate

# from backend_dateja.my_agent.main import graph
from backend_dateja.my_agent.WorkflowManager import WorkflowManager
from backend_dateja.my_agent.LLMManager import LLMManager
from backend_dateja.receptionist.assistant import VirtualAssistant

class CombinedAgent:
    def __init__(self, api_key, endpoint_url):
        self.csv_agent = WorkflowManager(api_key=api_key, endpoint_url=endpoint_url).returnGraph()
        self.receptionist_agent = VirtualAssistant(api_key=api_key).get_agent()
        self.llm_manager = LLMManager(api_key=api_key)
        self.router = self._create_router()

    def _create_router(self):
        
        csv_agent = Tool(
                name="CSV Agent",
                # description= """Use this agent for queries related to CSV data, data analysis, or data visualization. 
                # This includes analyzing CSV files, retrieving specific information from datasets, generating summary statistics, and visualizing data in the form of charts, graphs, or tables. 
                # Example queries handled by this agent include: 
                # 'How many male passengers survived?', 
                # 'Show the distribution of ages by gender', 
                # 'Give me a sales analysis report', 
                # 'How many products were sold?', 
                # 'Where was the product sold the most?', 
                # or any question involving CSV file content and analysis tasks.""",
                description="Select this agent for any query related to CSV files, data analysis, or visualization. This includes tasks like analyzing structured data, generating summaries, creating charts, or asking for specific information from CSV files. Even if the data is not provided, if the question relates to data analysis or visualization, this agent should be selected. Example queries: 'How many male passengers survived?', 'Show a chart of sales distribution', or 'Give me a data analysis report'. The agent will be sent the necessary data after selection.",
                llm=self.llm_manager.llm,
                func=lambda x: "CSV Agent",#func=self.csv_agent.invoke
            )
        
        receptionist_agent = Tool(
                name= "Receptionist Agent",
                # description= """Use this agent for handling general-purpose informational queries, providing explanations, definitions, or external references (e.g., Wikipedia articles or YouTube links). 
                # It acts as a receptionist at a hospital who answers basic user queries. It can answer conceptual questions, provide guidance on general topics, and explain technical or non-technical terms. 
                # Examples include:  
                # 'What is SQL?', 
                # 'Write me a SQL query to query a table', 
                # 'What is CSV?', 
                # 'How is CSV different from XLS?', 
                # 'What is the difference between a pie chart and a bar chart?', 
                # or general questions that requires general knowledge, tutorial-style assistance, or topic exploration.
                # This agent can also handle requests for Wikipedia information, YouTube links, or broad educational topics.""",
                description="Select this agent for any general-purpose or conceptual queries that do not require direct CSV data analysis. This includes questions about definitions, explanations, or technical assistance such as SQL queries, file format differences, or basic chart types. Even if the query mentions data, if it's asking for an explanation or help understanding concepts, this agent should be selected. Example queries: 'What is a CSV file?', 'What is SQL?', or 'What is the difference between a pie chart and a bar chart?'.",
                llm=self.llm_manager.llm,
                func=lambda x: "Receptionist Agent",#func=self.receptionist_agent.invoke
            )

        tools = [csv_agent, receptionist_agent]
        rendered_tools = self.render_text_description(tools)

        # prompt = ZeroShotAgent.create_prompt(
        #     tools,
        #     prefix="You are a router that directs queries to the appropriate agent. Analyze the query and choose the best agent to handle it.",
        #     suffix="Query: {input}\nThought: Decide which agent should handle this query. Respond with ONLY the name of the chosen agent (either 'CSV Agent' or 'Receptionist Agent'). \Action:",
        #     input_variables=["input"]
        # )

        # system_prompt = f"""You are an expert at choosing the right agent and returning its name. You are given two agent names `CSV Agent` and `Receptionist Agent`. Choose one of them based on the input query.
        # Here are the names and descriptions for each agent:

        # {rendered_tools}

        # Respond with ONLY the name of the chosen agent (either 'CSV Agent' or 'Receptionist Agent').
        # Given the user input, return the NAME of the agent. If the question is contains words like data, csv, data visualization, or analysis, RETURN 'CSV Agent'. Do not rethink more than TWICE.
        # """
        system_prompt = f"""You are an expert at selecting the correct agent for a query. Your task is to choose between two agents: `CSV Agent` and `Receptionist Agent`. Based on the user input, select the agent that best matches the query type.

        Here are the agent names and descriptions:
        {rendered_tools}

        Respond with ONLY the name of the chosen agent—either 'CSV Agent' or 'Receptionist Agent'. 
        - If the query involves CSV files, data analysis, data visualization, or structured data, return 'CSV Agent'.
        - For general questions, explanations, or non-data-related queries, return 'Receptionist Agent'.

        Do NOT request more information or analyze the data. Just choose the agent based on the query. Make your decision without rethinking more than twice.
        """
        prompt = ChatPromptTemplate.from_messages(
            [("system", system_prompt), ("user", "{input}")]
        )
        
        # llm_chain = LLMChain(llm=self.llm_manager.llm, prompt=prompt)
        # router = AgentExecutor.from_agent_and_tools(
        #     agent=ZeroShotAgent(llm_chain=llm_chain, tools=tools),
        #     tools=tools,
        #     verbose=True,
        #     handle_parsing_errors=True
        # )
        router = initialize_agent(tools=tools, 
                                llm=self.llm_manager.llm, 
                                agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, 
                                verbose=True, 
                                agent_kwargs={"prompt":prompt},
                                tags=['CSV Agent', 'Receptionist Agent'],
                                max_iterations=2,  # Set the maximum number of iterations
                                early_stopping_method="force"                                
                                )    
        return router

    def render_text_description(self, tools):
        return "\n".join([f"{tool.name}: {tool.description}" for tool in tools])


    def invoke(self, request) -> Dict[str, Any]:
        file_uuid = request.file_uuid
        query = request.query
        router_response = self.router.invoke({"input":query})
        print(f"Router response: {router_response}, and type: {type(router_response)}")
        if "CSV Agent" in router_response:
            if file_uuid is None:
                raise ValueError("file_uuid is required for CSV Agent queries")
            return self.csv_agent.invoke({"question": query, "file_uuid": file_uuid})
        elif "Receptionist Agent" in router_response:
            return self.receptionist_agent.invoke(query)
        else:
            raise ValueError("Router couldn't determine the appropriate agent")
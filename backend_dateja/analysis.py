import logging

import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from backend_dateja.my_agent.LLMManager import LLMManager

logger = logging.getLogger(__name__)

class AdvancedVisualizer:

    def __init__(self, df, api_key):
        self.df = df
        self.original_df = df.copy()
        self.metadata = None
        self.numeric_cols = self.df.select_dtypes(include=[np.number]).columns
        self.categorical_cols = self.df.select_dtypes(
            include=["object", "category"]
        ).columns
        self.datetime_cols = self.df.select_dtypes(include=["datetime64"]).columns
        self.llm = LLMManager(api_key=api_key)

    def generate_basic_insights(self):
        if self.df is None:
            return {"error": "No data available. Please upload data first."}

        try:
            insights = {
                "dataset_shape": None,
                "columns": None,
                "missing_values": {},
                "numeric_column_statistics": {},
                "categorical_column_information": {},
                "high_correlations": [],
                "data_types": {},
                "sample_data": None,
            }

            # 1. Basic dataset information
            insights["dataset_shape"] = {
                "rows": int(self.df.shape[0]),  # Convert to int
                "columns": int(self.df.shape[1])  # Convert to int
            }
            insights["columns"] = list(self.df.columns)

            # 2. Missing values
            missing_data = self.df.isnull().sum()
            for column, count in missing_data[missing_data > 0].items():
                insights["missing_values"][column] = {
                    "missing_count": int(count),  # Convert to int
                    "percentage": f"{(count/len(self.df)):.2%}"
                }

            # 3. Numeric column statistics
            numeric_cols = self.df.select_dtypes(include=[np.number]).columns
            for col in numeric_cols:
                insights["numeric_column_statistics"][col] = {
                    "mean": round(float(self.df[col].mean()), 2),  # Convert to float
                    "median": round(float(self.df[col].median()), 2),  # Convert to float
                    "std_dev": round(float(self.df[col].std()), 2),  # Convert to float
                    "min": round(float(self.df[col].min()), 2),  # Convert to float
                    "max": round(float(self.df[col].max()), 2)  # Convert to float
                }

            # 4. Categorical column information
            cat_cols = self.df.select_dtypes(include=["object"]).columns
            for col in cat_cols:
                insights["categorical_column_information"][col] = {
                    "unique_values": int(self.df[col].nunique()),  # Convert to int
                    "top_3_values": self.df[col].value_counts().nlargest(3).index.tolist()
                }

            # 5. Correlation insights (for numeric columns)
            if len(numeric_cols) > 1:
                corr_matrix = self.df[numeric_cols].corr()
                high_corr = corr_matrix[abs(corr_matrix) > 0.7].stack().reset_index()
                high_corr = high_corr[high_corr["level_0"] != high_corr["level_1"]]
                for _, row in high_corr.iterrows():
                    insights["high_correlations"].append({
                        "columns": (row['level_0'], row['level_1']),
                        "correlation_value": round(float(row[0]), 2)  # Convert to float
                    })

            # 6. Data types
            for col, dtype in self.df.dtypes.items():
                insights["data_types"][col] = str(dtype)

            # 7. Sample data
            insights["sample_data"] = self.df.head().to_dict(orient="records")

            return insights
        except Exception as e:
            logger.error(f"Error in generate_basic_insights: {str(e)}")
            logger.exception(e)
            return {"error": f"Error in generate_basic_insights: {str(e)}"}

    def generate_ai_insights(self, basic_insights):
        if self.df is None:
            return "No data available. Please upload data first."

        try:
            prompt = ChatPromptTemplate.from_messages([("human","""Analyze the following dataset summary and provide key insights, patterns, recommendations, and potential issues in JSON format.

                DATASET SUMMARY:
                {basic_insights}

                Please provide:
                1. Key insights about the data
                2. Potential patterns or trends
                3. Recommendations for further analysis or actions
                4. Any potential issues or areas of concern in the data
                5. Suggestions for feature engineering or model selection based on the data characteristics

                OUTPUT FORMAT:
                JSON
                {{
                    "key_insights": List[str], # List of key insights,
                    "potential_patterns": List[str], # List of potential patterns or trends,
                    "recommendations": List[str], # List of recommendations for further analysis or actions,
                    "issues": List[str], # List of potential issues or areas of concern,
                    "feature_engineering": List[str], # List of suggestions for feature engineering,
                    "model_selection": List[str], #List of suggestions for model selection
                }}

                Please analyze the data insights and return the response in provided JSON format.
                """)])
            output_parser = JsonOutputParser()
            response = self.llm.invoke(prompt, response_format={"type": "json_object"}, basic_insights=basic_insights)
            return output_parser.parse(response)
        except Exception as e:
            logging.error(f"Error generating AI insights: {str(e)}")
            return f"Error generating AI insights: {str(e)}"

    def generate_insights(self):
        basic_insights = self.generate_basic_insights()
        ai_insights = self.generate_ai_insights(basic_insights)
        insights = {"basic_insights": basic_insights, "ai_insights": ai_insights}
        return insights

    def generate_report(self):
        all_insights = self.generate_insights()
        basic_insights = all_insights["basic_insights"]
        ai_insights = all_insights["ai_insights"]
        try:
            prompt = ChatPromptTemplate.from_messages([("human","""
                Based on the following structured data insights, generate a comprehensive report highlighting key findings, potential areas of interest, and suggestions for further analysis:

                Basic insights = {basic_insights}
                
                AI insights = {ai_insights}

                Please structure your report in Markdown format with the following sections:
                1. Dataset Overview
                2. Data Quality Assessment
                3. Key Statistical Insights
                4. Categorical Data Analysis
                5. Correlation Analysis
                6. Recommendations for Further Analysis
                """)])
#             prompt = ChatPromptTemplate.from_messages(["human","""
# Based on the following structured data insights, generate a detailed and comprehensive report highlighting key findings, potential patterns, recommendations, and issues for further analysis. 
                                                  
# ### Data Insights:
# - **Basic Insights:** {basic_insights}
# - **AI-Generated Insights:** {ai_insights}

# The report should be structured in Markdown format and should include the following sections:

# ### Please structure your report with the following sections:

# 1. **Dataset Overview**
#     - Provide the dataset shape, column names, and data types.
#     - Include a sample of the data (first 5 rows).

# 2. **Data Quality Assessment**
#     - Discuss any missing values or data quality issues.
#     - Highlight potential issues with the data size or distribution.

# 3. **Key Statistical Insights**
#     - Present key statistical metrics (mean, median, standard deviation, min, max) for numeric columns.
#     - Highlight any important trends or deviations in the data.

# 4. **Categorical Data Analysis**
#     - Analyze the unique and top values for each categorical column.
#     - Summarize trends or patterns observed in the categorical data.

# 5. **Correlation Analysis**
#     - Report any high correlations between numeric variables.
#     - Provide insights into the relationships (positive or negative correlations) between variables, and their implications.

# 6. **AI-Generated Key Insights**
#     - Summarize key insights, patterns, and trends detected from the data.
#     - Include observations about price, stock quantities, or other important variables.

# 7. **Recommendations for Further Analysis**
#     - Suggest further actions to improve the analysis, such as collecting more data, investigating correlations, or engineering new features.
#     - Provide recommendations for future modeling or analysis approaches based on the current insights.

# 8. **Issues Identified**
#     - Discuss any issues or limitations encountered during the analysis, such as small sample size or data inconsistencies.
#     - Explain how these issues could impact the reliability of the insights.

# Please ensure the report is written in a clear, structured, and informative manner.                                                   
# """])
            output_parser = JsonOutputParser()
            response = self.llm.invoke(prompt, ai_insights=ai_insights, basic_insights=basic_insights)
            return response
        except Exception as e:
            logging.error(f"Error generating report: {str(e)}")
            return f"Error generating report: {str(e)}"


    def create_numeric_summaries(self, columns):
        fig = make_subplots(
            rows=len(columns),
            cols=2,
            subplot_titles=[f"{col} Distribution" for col in columns for _ in range(2)],
        )
        for i, col in enumerate(columns, 1):
            fig.add_trace(
                go.Histogram(x=self.df[col], name=f"{col} Histogram", nbinsx=30),
                row=i,
                col=1,
            )
            fig.add_trace(go.Box(y=self.df[col], name=f"{col} Box Plot"), row=i, col=2)
        fig.update_layout(
            height=300 * len(columns),
            title_text="Numeric Column Distributions",
            showlegend=False,
            margin=dict(l=60, r=60, t=60, b=60),
            autosize=True,
        )
        fig.update_xaxes(title_text="Value")
        fig.update_yaxes(title_text="Frequency", col=1)
        fig.update_yaxes(title_text="Value Distribution", col=2)
        return fig

    def create_correlation_heatmap(self, columns):
        corr_matrix = self.df[columns].corr()
        fig = go.Figure(
            data=go.Heatmap(
                z=corr_matrix.values,
                x=corr_matrix.columns,
                y=corr_matrix.columns,
                colorscale="RdBu",
                zmin=-1,
                zmax=1,
                colorbar=dict(title="Correlation"),
            )
        )
        fig.update_layout(
            title="Correlation Between Numeric Variables",
            height=600,
            width=800,
            xaxis_title="Variables",
            yaxis_title="Variables",
            margin=dict(l=60, r=60, t=60, b=60),
            autosize=True,
        )
        return fig

    def create_categorical_summaries(self, columns, top_n=15):
        fig = make_subplots(
            rows=len(columns),
            cols=1,
            vertical_spacing=0.2,  # Increase vertical spacing between subplots
        )
        for i, col in enumerate(columns, 1):
            value_counts = self.df[col].value_counts()
            top_n_counts = value_counts.nlargest(top_n)
            other_count = value_counts.sum() - top_n_counts.sum()
            if other_count > 0:
                top_n_counts["Other"] = other_count
            fig.add_trace(
                go.Bar(x=top_n_counts.index, y=top_n_counts.values, name=col),
                row=i,
                col=1,
            )

            # Update x-axis for each subplot individually
            fig.update_xaxes(
                tickangle=-45, title_text=col, automargin=True, row=i, col=1
            )

        fig.update_layout(
            height=500 * len(columns),  # Adjust height per subplot
            title_text="Top 15 Categories for Each Categorical Variable",
            showlegend=False,
            margin=dict(l=80, r=20, t=100, b=50, pad=4),
        )

        fig.update_yaxes(title_text="Count", title_standoff=15)

        # Adjust layout for better spacing
        fig.update_layout(
            uniformtext_minsize=8, uniformtext_mode="hide", bargap=0.15, bargroupgap=0.1
        )

        return fig

    def handle_request(self, action):
        if action == "basic_insights":
            return self.generate_basic_insights()
        elif action == "ai_insights":
            return self.generate_ai_insights()
        elif action == "insights":
            return self.generate_insights()
        elif action == "generate_report":
            return self.generate_report()
        elif action == "numeric_summaries":
            return self.create_numeric_summaries(self.numeric_cols)
        elif action == "correlation_heatmap":
            return self.create_correlation_heatmap(self.numeric_cols)
        elif action == "categorical_summaries":
            return self.create_categorical_summaries(self.categorical_cols)
        else:
            return "Invalid action provided. Please choose from: basic_insights, ai_insights, insights, numeric_summaries, correlation_heatmap, categorical_summaries."

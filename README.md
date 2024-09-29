<div align="center">

  <a href="https://github.com/Ki55n/DataFusion-Gen-AI-Hack">
    <img src="./docs/logos/datafusion_logo.png" alt="DataFusion" width="200">
  </a>

  <p align="center">
    <!-- <br /> -->
    <a href="https://data-fusion-umber.vercel.app/login">Website</a>
    ·
    <a href="./docs">Docs</a>
  </p>
</div>

----------------------------------------
**DataFusion** is an innovative AI-powered platform that transforms how businesses interact with and manage data. It offers a full-fledged web framework to manage your data, use natural language querying and visualization, and enables interactions across multiple data sources.

<p align="center">
  <img src="./docs/logos/DataFusion_Description.svg"/>
</p>


## 🛠️ Features

1. **Easy grouping** of similar data sources (Projects and Active Projects)
2. **Language Query** for intuitive multi-table data exploration
3. **Generative interactive charts** for dynamic data visualization
4. **Automated data insights** and **data cleaning pipelines**
5. **Text-to-SQL** query options
6. **Voice-activated** chart explanations
7. Supports `csv`, `xls`, and `sqlite` file formats

## 🚀 Get Started

To get started:

1. Jump to the [project page](project/page/link) and create an account.
2. Create a project for your data source. For example: `Project E-Commerce`
3. Upload all the relevant data sources to the project. For example: `Customers.csv`, `Profits.csv`, `Orders.csv`, and `Products.csv`.
4. Load the project into **Active Projects**. This step will run two different pipelines: data cleaning and data analysis.
5. Once the active project is ready, open the `DataFusion Chat` window on the right.
6. Ask questions in plain English. For example: `How were mobile phone sales in the first quarter of 2024?` or `Plot a bar chart for mobile phone sales by month.`
7. Store the generated visualizations to the `Visualizer` page for later exploration. 


## 💡 Example Queries
The model's responses depend heavily on the input queries. Whether you receive a simple one-liner answer, a detailed explanation, or a visualization depends on the query and the specific keywords used. Below, we'll explore how queries and their responses can vary.

Consider you have a dataset of passengers who survived the Titanic accident. You may want to ask the following queries:

1. What is the distribution of passenger classes (first, second, third) on the Titanic?
   - Provides a text answer and plots a `pie chart` showing the number of people in each passenger class.

2. How many males survived the Titanic accident?
   - Returns a text answer as visualization is not applicable.

3. How does the survival rate vary across different age groups?
   - Plots a line graph and explains how the survival rate changes for different age groups.

4. Plot a bar chart to understand the age distribution of males vs females.
   - Explicitly plots a bar chart showing the age distribution, distinguishing between males and females.

## 📂 File Structure

- `main.py` - Main file where the AI server app is defined.
- `backend/`
  - `my_agent/` - Backbone of the AI server.
  - `sqlite-server/` - Backbone of the SQLite server.
- `frontend/`

## 📖 About us
We are a dedicated team of developers passionate about simplifying data analysis and visualization. 

Team members: 
- Akshay Pimpalkar
- Himesh Parashar
- Kiran Chawan
- Mamoon Jan



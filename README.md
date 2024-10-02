
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

---

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

1. Jump to the [project page](https://data-fusion-gen-ai-hack.vercel.app/) and create an account.
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
- `interface/`

The Next.js application resides in the `interface` folder. All frontend functionalities and interactions are managed here.

### Setting Up the Interface

To set up and run the project locally:

1. **Clone the Repository**:  
   Clone the repository to your local machine.

   ```bash
   git clone https://github.com/Ki55n/DataFusion-Gen-AI-Hack.git
   ```

2. **Install Dependencies**:  
   Navigate to the `interface` folder and install the required dependencies.

   ```bash
   cd interface
   npm install
   ```

3. **Set Up Environment Variables**:  
   Copy the provided `.env.example` file and rename it to `.env`.

   ```bash
   cp .env.example .env
   ```

   Fill in the necessary environment variables (e.g., Firebase and MongoDB credentials).

   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   NEXT_PUBLIC_MONGO_URL=your_mongo_url
   NEXT_PUBLIC_SQLITE_URL="http://localhost:8000"
   NEXT_PUBLIC_AI_BACKEND_URL="http://localhost:8001"
   ```

4. **Run the Application**:  
   After configuring the environment, start the development server.

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

### Setting Up FastAPI AI Backend

In addition to the Next.js frontend, this project also includes a Python FastAPI service that handles all AI and data operations. The FastAPI service is responsible for running both the SQLite server and the AI backend.

#### GCP-Deployed FastAPI URLs:

- **NEXT_PUBLIC_SQLITE_URL**: [https://datafusion-deployed-235676937529.northamerica-northeast1.run.app/sqlite-server/](https://datafusion-deployed-235676937529.northamerica-northeast1.run.app/sqlite-server/)
- **NEXT_PUBLIC_AI_BACKEND_URL**: [https://datafusion-deployed-235676937529.northamerica-northeast1.run.app/ai-server/](https://datafusion-deployed-235676937529.northamerica-northeast1.run.app/ai-server/)

#### Running FastAPI Locally

To run the FastAPI service locally:

1. **Build the Docker Image**:

   ```bash
   docker build -t datafusion .
   ```

2. **Run the Docker Container**:

   ```bash
   docker run -p 8000:8000 -p 8001:8001 -d datafusion
   ```

For local development, update the `.env` file inside the `interface` folder with:

```bash
NEXT_PUBLIC_SQLITE_URL="http://localhost:8000"
NEXT_PUBLIC_AI_BACKEND_URL="http://localhost:8001"
```

> **ℹ️ For more detailed setup documentation, please visit:**  
> [**Setup Documentation**](./docs/)

## 🌐 Deployed Application

The application is deployed and can be accessed at:  
[https://data-fusion-gen-ai-hack.vercel.app/](https://data-fusion-gen-ai-hack.vercel.app/)

## 🧪 Testing Credentials

For testing purposes, you can use the following credentials:

- **Email**: lemag27343@abevw.com
- **Password**: Datafusion@123

## 📖 About us

We are a dedicated team of developers passionate about simplifying data analysis and visualization.

Team members:

- Akshay Pimpalkar
- Himesh Parashar
- Kiran Chawan
- Mamoon Jan

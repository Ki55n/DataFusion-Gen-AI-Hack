# Data Fusion Interface - Next.js Application

This is the frontend application for the Data Fusion product. It is built using **Next.js** and resides in the `interface` folder of the root directory. The application handles project creation, file management, user flows, and data visualization. It communicates with a Python backend for chatbot queries, data cleaning, and visualization tasks.

## Getting Started

### Prerequisites

Ensure that you have the following installed:

- Node.js (version 14 or later)
- npm (version 6 or later)
- Vercel CLI (optional for deployment)

### Folder Structure

```
root/
│
└── interface/
    ├── public/
    └── src
        |── app
        |── components
        |── constants
        |── db
        |── lib
    ├── .env.example
    ├── next.config.js
    ├── package.json
    └── ...
```

The Next.js application resides in the `interface` folder. All frontend functionalities and interactions are managed here.

### Setting Up the Project

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
   # NEXT_PUBLIC_SQLITE_URL=your_sqlite_url
   # NEXT_PUBLIC_AI_BACKEND_URL=your_ai_backend_url
   ```

4. **Run the Application**:  
   After configuring the environment, start the development server.

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

### Deploying to Vercel

To deploy the application to Vercel:

1. **Login to Vercel**:
   If you haven't installed the Vercel CLI, you can do so via npm:

   ```bash
   npm install -g vercel
   ```

   Log in using your Vercel credentials:

   ```bash
   vercel login
   ```

2. **Deploy the Application**:

   ```bash
   vercel
   ```

   Follow the prompts to deploy the application to your Vercel account.

### Notes

- **Backend URL**: The Next.js frontend interacts with a Python backend for data analysis and chatbot functionality. If you have an AI backend service, ensure to configure the `NEXT_PUBLIC_AI_BACKEND_URL` in your `.env` file.
- **Firebase Integration**: The application uses Firebase for authentication and database storage. Ensure all Firebase-related credentials are correctly filled out in the `.env` file.

---

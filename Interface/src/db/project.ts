"use server";

import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

interface File {
  name: string;
  size: number;
  dateUploaded: Date;
  _id?: ObjectId; // Optional if MongoDB generates it
}

interface Project {
  name: string;
  description: string;
  createdAt: Date;
  status: string;
  files: File[];
  _id?: ObjectId; // Optional if MongoDB generates it
  userId: string; // Assuming userId is a string, modify as needed
}

async function createProject(project: Project) {
  try {
    await client.connect();
    const database = client.db("test");
    const projects = database.collection("projects");

    // MongoDB will generate _id if it's not provided
    const result = await projects.insertOne(project);
    console.log(
      `New project created with the following id: ${result.insertedId}`
    );
  } catch (err) {
    console.error("Error creating project:", err);
  } finally {
    await client.close();
  }
}

async function getProjectsByUserId(userId: string) {
  try {
    await client.connect();
    const database = client.db("test");
    const projects = database.collection("projects");

    // Assuming userId is stored as a string in MongoDB, no need for ObjectId conversion
    const query = { userId };
    const userProjects = await projects.find(query).toArray();
    console.log(userProjects);
  } catch (err) {
    console.error("Error fetching projects:", err);
  } finally {
    await client.close();
  }
}

"use server";

import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import { addProjectToUser } from "./user";

const uri = process.env.NEXT_PUBLIC_MONGO_URL || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export interface File {
  name: string;
  size: number;
  dateUploaded: Date;
  file_uuid: string; // Optional if MongoDB generates it
}

export interface Project {
  name: string;
  description: string;
  createdAt: Date;
  status: string;
  files: File[];
  _id?: ObjectId; // MongoDB will generate this
  userId: string; // Assuming userId is a string, modify as needed
}

export async function createProject(userId: string, project: Project) {
  try {
    await client.connect();
    console.log("connected");
    const database = client.db("datafusion");
    const projects = database.collection("projects");

    // MongoDB will generate _id if it's not provided
    const result = await projects.insertOne(project);
    const addtousr = await addProjectToUser(userId, result.insertedId);
    return project;
  } catch (err) {
    console.error("Error creating project:", err);
  } finally {
    await client.close();
  }
}

export async function getProjectsByUserId(userId: string) {
  try {
    await client.connect();
    const database = client.db("datafusion");
    const projects = database.collection("projects");
    const query = { userId };
    const userProjects = await projects.find(query).toArray();
    const formattedProjects = userProjects.map((project) => ({
      _id: project._id.toString(),
      name: project.name,
      description: project.description,
      createdAt: new Date(project.createdAt),
      status: project.status,
      files: project.files || [],
      userId: project.userId,
    }));

    return formattedProjects;
  } catch (err) {
    console.error("Error fetching projects:", err);
    return [];
  } finally {
    await client.close();
  }
}

export async function getProjectDetails(userId: string, projectId: string) {
  try {
    await client.connect();
    const database = client.db("datafusion");
    const projects = database.collection("projects");
    const query = { userId, _id: new ObjectId(projectId) };
    const project = await projects.findOne(query);
    if (project) {
      const formattedProject = {
        _id: project._id.toString(),
        name: project.name,
        files: project.files || [],
      };
      return formattedProject;
    } else {
      console.error("No project found with the provided ID for this user.");
      return null;
    }
  } catch (err) {
    console.error("Error fetching project details:", err);
    return null;
  } finally {
    await client.close();
  }
}

export async function changeProjectStatus(
  projectId: string,
  newStatus: string
) {
  try {
    await client.connect();
    const database = client.db("datafusion");
    const projects = database.collection("projects");
    const query = { _id: new ObjectId(projectId) };
    const update = { $set: { status: newStatus } };
    const result = await projects.updateOne(query, update);
    if (result.modifiedCount === 1) {
      console.log("Successfully updated project status.");
    } else {
      console.error("Failed to update project status.");
    }
  } catch (err) {
    console.error("Error updating project status:", err);
  } finally {
    await client.close();
  }
}

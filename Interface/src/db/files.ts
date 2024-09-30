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

export async function getFilesByUserIdProjectId(
  userId: string,
  projectId: string
) {
  try {
    await client.connect();
    const database = client.db("datafusion");
    const files = database.collection("files");
    const query = { userId, projectId };
    const userFiles = await files.find(query).toArray();
    const formattedFiles = userFiles.map((file) => ({
      file_uuid: file.file_uuid,
      name: file.name,
      description: file.description,
      size: file.size,
      dateUploaded: new Date(file.dateUploaded),
    }));

    return formattedFiles;
  } catch (err) {
    console.error("Error fetching files:", err);
    return [];
  } finally {
    await client.close();
  }
}

export async function uploadFileToDb(
  userId: string,
  projectId: string,
  description: string,
  file: File
) {
  console.log(file);
  try {
    await client.connect();
    const database = client.db("datafusion");
    const files = database.collection("files");
    const projects = database.collection("projects");

    // Create the new file object
    const newFile = {
      file_uuid: file.file_uuid,
      userId,
      projectId,
      name: file.name,
      size: file.size,
      dateUploaded: new Date(),
      description: description,
    };

    // Insert the new file into the files collection
    const result = await files.insertOne(newFile);
    if (result.acknowledged) {
      console.log(
        `New file inserted with the following id: ${result.insertedId}`
      );

      const project = await projects.findOne({
        userId: userId,
        _id: new ObjectId(projectId),
      });

      console.log(userId);
      console.log(projectId);
      console.log(project);
      if (project) {
        const updating = await projects.updateOne(
          { userId: userId, _id: new ObjectId(projectId) },
          //@ts-ignore
          { $push: { files: newFile } }
        );
        console.log(updating);
        console.log("File added to project");
      }

      return result.insertedId.toString();
    }
  } catch (err) {
    console.error("Error uploading file:", err);
    return null;
  } finally {
    await client.close();
  }
}

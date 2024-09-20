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
  _id: string; // Optional if MongoDB generates it
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
      _id: file._id.toString(),
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
  try {
    await client.connect();
    const database = client.db("datafusion");
    const files = database.collection("files");
    const newFile = {
      userId,
      projectId,
      name: file.name,
      size: file.size,
      dateUploaded: new Date(),
      description: description,
    };
    const result = await files.insertOne(newFile);
    if (result.acknowledged) {
      console.log(
        `New file inserted with the following id: ${result.insertedId}`
      );
    }
    return result.insertedId.toString();
  } catch (err) {
    console.error("Error uploading file:", err);
    return null;
  } finally {
    await client.close();
  }
}

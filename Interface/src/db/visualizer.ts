"use server";

import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

const uri = process.env.NEXT_PUBLIC_MONGO_URL || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export interface Visualization {
  _id: string;
  userId: string;
  visualizationType: string;
  fileId: string;
  fileName: string;
  data: any;
  description: string;
  layout: {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  summary: string;
}

export async function getVisualizations(
  userId: string
): Promise<Visualization[]> {
  try {
    await client.connect();
    const database = client.db("datafusion");
    const visualizations = database.collection("visualizations");
    const result = await visualizations.find({ userId }).toArray();

    // Serialize the ObjectId to string and ensure all properties of Visualization are included
    return result.map((doc) => ({
      _id: doc._id.toString(),
      userId: doc.userId,
      visualizationType: doc.visualizationType,
      fileId: doc.fileId,
      fileName: doc.fileName,
      data: doc.data,
      description: doc.description,
      layout: doc.layout,
      summary: doc.summary,
    }));
  } catch (err) {
    console.error("Error fetching visualizations:", err);
    return [];
  } finally {
    await client.close();
  }
}

interface LayoutUpdate {
  _id: string;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export async function updateVisualizationLayout(
  updates: LayoutUpdate[]
): Promise<boolean> {
  try {
    await client.connect();
    const database = client.db("datafusion");
    const visualizations = database.collection("visualizations");

    const updateOperations = updates.map((update) => ({
      updateOne: {
        filter: { _id: new ObjectId(update._id) },
        update: { $set: { layout: update.layout } },
      },
    }));

    const result = await visualizations.bulkWrite(updateOperations);
    return result.modifiedCount === updates.length;
  } catch (err) {
    console.error("Error updating visualization layouts:", err);
    return false;
  } finally {
    await client.close();
  }
}

export async function saveVisualization(
  visualization: Omit<Visualization, "_id">
): Promise<string | null> {
  try {
    await client.connect();
    const database = client.db("datafusion");
    const visualizations = database.collection<Visualization>("visualizations");

    const result = await visualizations.insertOne({
      ...visualization,
      _id: new ObjectId().toString(),
    });

    return result.insertedId.toString();
  } catch (err) {
    console.error("Error saving visualization:", err);
    return null;
  } finally {
    await client.close();
  }
}

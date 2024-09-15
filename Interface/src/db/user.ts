import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function getUser(userId) {
  try {
    await client.connect();
    const database = client.db("test");
    const users = database.collection("users");
    const user = await users.findOne({ _id: userId });
    return user;
  } finally {
    await client.close();
  }
}

async function addUser(name, email, userId, projects) {
  try {
    await client.connect();
    const database = client.db("test");
    const users = database.collection("users");
    const res = await users.insertOne({ name, email, _id: userId, projects });
    return res;
  } finally {
    await client.close();
  }
}

async function updateUser(userId, name, email, projects) {
  try {
    await client.connect();
    const database = client.db("test");
    const users = database.collection("users");
    const res = await users.updateOne(
      { _id: userId },
      { $set: { name, email, projects } }
    );
    return res;
  } finally {
    await client.close();
  }
}

async function deleteUser(userId) {
  try {
    await client.connect();
    const database = client.db("test");
    const users = database.collection("users");
    const res = await users.deleteOne({ _id: userId });
    return res;
  } finally {
    await client.close();
  }
}

export { getUser, addUser, updateUser, deleteUser };

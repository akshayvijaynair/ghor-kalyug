import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not set.");
}

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

async function connectToDatabase() {
  try {
    await client.connect();
    // Test the connection
    await client.db("gemini_quizzes").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); 
  }
}

connectToDatabase();

const db = client.db("gemini_quizzes");
export default db;

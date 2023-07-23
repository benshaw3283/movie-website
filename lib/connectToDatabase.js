import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let clientPromise;

async function connectToDatabase() {
  if (!uri) {
    throw new Error("Please add your Mongo URI to .env.local");
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, options);
    try {
      clientPromise = client.connect();
      await clientPromise; // Wait for the connection to be established
    } catch (err) {
      // Handle connection errors
      console.error("Error connecting to MongoDB:", err);
      throw err; // Rethrow the error to be caught at the caller's level
    }
  }

  return clientPromise;
}

export default connectToDatabase;

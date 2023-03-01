import { MongoClient } from 'mongodb';


const uri = process.env.MONGODB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!cachedClient || !cachedClient.isConnected()) {
    cachedClient = await MongoClient.connect(uri, options);
  }

  cachedDb = cachedClient.db(process.env.MONGODB_DB);

  return cachedDb;
}
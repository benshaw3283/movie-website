import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

let client;
let clientPromise;

const connectToDatabase = async () => {
  if (!clientPromise) {
    client = new MongoClient(uri, options)
    clientPromise = await client.connect()
  }
  return clientPromise
} 

export { connectToDatabase }
export default clientPromise

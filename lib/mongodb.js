// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from 'mongodb'


const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}


const options = {
}

let client;
let clientPromise;


  client = new MongoClient(uri, options)
  clientPromise = client.connect()

 //Export a module-scoped MongoClient promise. By doing this in a
//separate module, the client can be shared across functions.
export default clientPromise


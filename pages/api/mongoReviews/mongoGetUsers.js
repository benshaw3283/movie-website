
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function mongoGetUsers(req, res) {
  if (req.method === "GET") {
    try {
      
      const client = await connectToDatabase(); // Await the connection to be established
      
      
      const allUsers = await client
        .db()
        .collection("users")
        .find()
        .toArray(); // Fetch all reviews from the database
        
        
        const users = allUsers.map((user)=> (user.username ? user.username : user.name))
        
      res.status(200).json(users); // Send the retrieved reviews as response
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Handle other HTTP methods
    res.status(405).end();
  }
}

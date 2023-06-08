import connectToDatabase from "../../../lib/connectToDatabase";

export default async function reportBug(req, res) {
  if (req.method === "POST") {
    const {user,  report } = req.body;
    // Check if the required fields are present
    if ( report === '') {
      res.status(400).json({ message: "Missing required fields" });

      return;
    }
    try {
     const client =  await connectToDatabase()
    
      const db = client.db();

      const data = await db.collection("bugs").insertOne({
        user: user,
        report: report
      });
      
      res.status(201).json({ message: "Bug Reported!" }, data);
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

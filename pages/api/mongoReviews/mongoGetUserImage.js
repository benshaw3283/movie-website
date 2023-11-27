import { getSession } from "next-auth/react";
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function mongoGetUser(req, res) {
  if (req.method === "GET") {
    try {
      const client = await connectToDatabase();

      const collection = client.db().collection("users");

      // Retrieve the session
      const session = await getSession({ req });

      if (session) {
        // Fetch the user from the database based on the username
        const user = await collection.findOne({
          username: session.user.username,
        });

        if (user) {
          // Access the user's image
          const image = user.image;

          // Use the image in your code
          // ...

          res.status(200).json({ image }); // Send the image as the response
        } else {
          // User not found in the database
          res.status(404).json({ message: "User not found" });
        }
      } else {
        // Session not found
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    // Handle other HTTP methods
    res.status(405).end();
  }
}

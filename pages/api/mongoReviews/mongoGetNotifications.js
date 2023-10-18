import connectToDatabase from "../../../lib/connectToDatabase";

export default async function mongoGetNotifications(req, res) {
  if (req.method === "GET") {
    try {
      const client = await connectToDatabase();

      const db = client.db();

      const { user } = req.query;

      // Fetch the specific post using the postId
      const sessionUser = await db
        .collection("users")
        .findOne({ username: user });

      if (sessionUser) {
        let notifications = sessionUser?.notifications || [];

        res.status(200).json(...notifications);
      } else {
        res.status(404).json({ message: "Notifications not found" });
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

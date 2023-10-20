import connectToDatabase from "../../../lib/connectToDatabase";

export default async function addFollower(req, res) {
  if (req.method === "PATCH") {
    const { username, follower } = req.body;
    const datE = new Date();
    const date = datE.toISOString();

    try {
      const client = await connectToDatabase();

      const db = client.db();

      const data = await db.collection("users").findOneAndUpdate(
        { username: username },
        {
          $addToSet: {
            followers: follower,
            notifications: { follower, seen: false, date },
          },
        },
        { returnDocument: "after" }
      );

      const data2 = await db
        .collection("users")
        .findOneAndUpdate(
          { username: follower },
          { $addToSet: { follows: username } },
          { returnDocument: "after" }
        );

      res.status(201).json({ message: "Follower added!", ...data, ...data2 });
    } catch (err) {
      // Log the error and return an error response
      console.error(err);
      return res.status(500).json({
        message: "Internal server error - Unable to add follower",
      });
    }
  }
}

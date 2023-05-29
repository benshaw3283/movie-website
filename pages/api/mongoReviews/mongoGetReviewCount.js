import connectToDatabase from "../../../lib/connectToDatabase";

export default async function mongoGetReviewCountHandler(req, res) {
    if (req.method === "GET") {
      try {
        const client = await connectToDatabase();
        const count = await client.db().collection("posts").countDocuments();
        res.status(200).json({ count });
      } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      res.status(405).end();
    }
  }
  
import { hashPassword } from "../../../lib/auth";
import { MongoClient } from "mongodb";
import connectToDatabase from "../../../lib/connectToDatabase";

export default async function signUpHandler(req, res) {
  const client = await connectToDatabase();
  
  if (req.method === "POST") {
    //Getting email and password from body
    const { email, username, password } = req.body;
    //Validate
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.length < 7 ||
      !username ||
      username.length < 5
    ) {
      res.status(422).json({
        message:
          "Invalid input - password should be at least 7 characters long.",
      });
      return;
    }
    try {
      const db = client.db();
      //Check existing
      const checkExisting = await db
        .collection("users", "accounts")
        .findOne({ username: username, email: email });
      //Send error response if duplicate user is found
      if (checkExisting) {
        res.status(422).json({
          message: "Account with this username or email already exists",
        });
        return;
      }
      //Hash password
      const hashedPassword = await hashPassword(password);

      const status = await db.collection("users").insertOne({
        email: email,
        username: username,
        password: hashedPassword,
      });
      //Send success response
      res.status(201).json({ message: "User created!", ...status });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

// Close the connection pool when the Node.js process exits
process.on("SIGINT", () => {
  client.close();
  process.exit();
});

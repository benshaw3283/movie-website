import { hashPassword } from "../../../lib/auth";
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
        image: `data:image/png;base64,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`,
        followers: [],
        follows: [],
        bio: "",
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

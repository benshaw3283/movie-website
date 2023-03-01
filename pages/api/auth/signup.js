import { data } from "autoprefixer";
import { hash } from "bcryptjs";
import connectMongo from "../../../database/connection";
import Users from "../../../model/Schema";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function signUpHandler(req, res) {
  try {
    connectToDatabase();
  } catch (error) {
    return res.json({ error: "Connection Failed..." });
  }

  //only post method accepted
  if (req.method === "POST") {
    if (!req.body)
      return res.status(404).json({ error: "Don't have form data..." });

    const { username, email, password } = req.body;



    //check duplicate users
    const checkExisting = await Users.findOne({ username });
    if (checkExisting)
      return res.status(422).json({ message: "User already exists..." });

     //hash password
     const createUser = await Users.create({
        username,
        email,
        password: await hash(password, 12),
      });
      return res.json(createUser);
   
  } else {
    return res
      .status(500)
      .json({ message: "HTTP method not valid, only POST Accepted" });
  }
} 


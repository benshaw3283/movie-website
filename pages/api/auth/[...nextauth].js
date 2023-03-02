import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { connectToDatabase } from "../../../lib/mongodb";
import { MongoClient } from "mongodb";
import { verifyPassword } from "../../../lib/auth";

export const authOptions = {
  session: {
    jwt: true,
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",

      async  authorize(credentials) {
        const client = await connectToDatabase()
          
            const usersCollection = client.db().collection("users");
            const user = await usersCollection.findOne({ username: credentials.username });
         
          
            if (!user) {
              throw new Error("No user found with this username...");
            }

            const isValid= await verifyPassword(credentials.password, user.password);
          
          
            if (!isValid) {
              throw new Error("Could not log you in!");
             
            }
            client.close();

            return {
              id: user.id,
              username: user.username,
              email: user.email,
            };          
      
      },
    } ),
  ],

  secret: process.env.JWT_SECRET,

  adapter: () =>
    connectToDatabase().then((db) => MongoDBAdapter(db, process.env.MONGODB_DB)),
};

export default NextAuth(authOptions);

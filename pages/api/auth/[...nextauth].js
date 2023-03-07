import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import connectToDatabase from "../../../lib/mongodb";
import { verifyPassword } from "../../../lib/auth";
import { getSession, getUser } from "next-auth/react";

export const authOptions = {
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

      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials) {
        try {
          console.log("starting auth process...");
          const client = await connectToDatabase();
          console.log(client);
          console.log("connected to database");

          const usersCollection = client.db().collection("users");
          console.log(`retrieved user collection:`, usersCollection);

          const user = await usersCollection.findOne({
            username: credentials.username,
          });
          console.log("Found user:", user);

          if (!user) {
            throw new Error("No user found with this username...");
          }

          const isValid = await verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error("Could not log you in!");
          }
          client.close();
          console.log("auth successful");

          return {
            id: user._id,
            username: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error(error);
        }
      },
    }),
  ],
  callbacks: {
    async session(session, user) {
      session.user = user;
      return session;
    },
    async jwt(token, user) {
      if (user) {
        token.id = user._id;
      }
      return token;
    },
  },
  database: process.env.MONGODB_URI,
  session: {
    jwt: true,
  },
  jwt: { secret: process.env.JWT_SECRET },
  pages: {
    signIn: "/login",
    signOut: "/signout",
    error: "/login",
  },
  debug: true,

  adapter: () =>
    connectToDatabase().then((db) =>
      MongoDBAdapter(db, process.env.MONGODB_DB)
    ),
};

export default NextAuth(authOptions);

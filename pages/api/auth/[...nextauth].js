import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import connectToDatabase from "../../../lib/mongodb";
import { verifyPassword } from "../../../lib/auth";
import clientPromise from "../../../lib/fuck";

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

      async authorize(credentials) {
        try {
          console.log("starting auth process...");
          const client = await connectToDatabase();

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

  session: {
    strategy: "jwt",
  },

  secret: process.env.JWT_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      if (user?.username) token.username = user.username;

      return token;
    },

    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      if (token?.username) session.user.username = token.username;
      token.username = session.user.username
      return session;
    },
  },

  debug: true,

  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "movie-website",
  }),
};

export default NextAuth(authOptions);

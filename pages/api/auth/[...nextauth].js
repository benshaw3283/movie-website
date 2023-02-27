import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "../../../database/connection";
import Users from "../../../model/Schema";
import { compare } from "bcryptjs";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

export const authOptions = ({
 
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }),
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET
      }),
      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        
        async authorize(credentials, req) {
          connectMongo().catch(error => {error: 'Connection failed...'})

          //check user existence
          const result = await Users.findOne({username: credentials.username})
          if(!result){
            throw new Error('No user found with this username...')
          }

          //compare function
          const checkPassword = await compare(credentials.password, result.password)

          //incorrect password
          if (!checkPassword || result.username !== credentials.username){
            throw new Error('Username or Password does not match')
          }
          return result;

        }
      })

  ],
  secret: process.env.JWT_SECRET,
  
  
});

export default NextAuth(
  authOptions,
  
)
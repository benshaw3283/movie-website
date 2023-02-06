import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
      // Sign in with passwordless email link
      EmailProvider({
        server: process.env.MAIL_SERVER,
        from: "<no-reply@example.com>",
      })
  ],
}

export default NextAuth(authOptions)
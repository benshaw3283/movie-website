import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import FacebookProvider from 'next-auth/providers/facebook'

export const authOptions = ({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }),
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET
      })
  ],
  secret: process.env.JWT_SECRET,

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      session.accessToken = token.accessToken
      session.user.id = token.id
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = profile.id
      }
      return token
    }
}
});

export default NextAuth(authOptions)
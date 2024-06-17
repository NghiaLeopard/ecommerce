import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      name: 'google'
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
      name: 'facebook'
    })
  ],
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token
      }

      if (account && account.provider) {
        token.provider = account.provider
      }

      return token
    },
    async session({ session, token, user }: any) {
      session.accessToken = token.accessToken
      session.provider = token.provider

      return session
    }
  }
}

export default NextAuth(authOptions)

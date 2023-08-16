import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Discord from 'next-auth/providers/discord'
import Google from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental // will be removed in future
} = NextAuth({
  providers: [
    GitHub,
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    jwt({ token, profile }) {
      if (!token.id) {
        console.log('sub', token.id == undefined)
        token.id = token.sub
      }
      if (profile) {
        // token.id = profile.id ? profile.id : token.id
        token.image = profile.picture
      }
      console.log('token', token)
      return token
    },
    authorized({ auth }) {
      console.log('authhhhh', auth)
      return !!auth?.user // this ensures there is a logged in user for -every- request
    }
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  }
})

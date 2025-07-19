import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge'
import type { NextAuthConfig } from 'next-auth'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const config = {
  pages: {
    signIn: '/signIn',
    error: '/signIn'

  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      async authorize(credentials) {
        if (credentials === null) return null

        //Find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string
          }
        })

        // Check if the user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(credentials.password as string, user.password)
          // If password is correct return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          }
        }
        // If user doesn't exist or password doesn't match return null
        return null
      },
    })
  ],
  callbacks: {

    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name ?? user.email?.split('@')[0];
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
      };
      return session;
    },
    authorized({ request, auth }: any) {
      // Check for session cart cookie
      if (!request.cookies.get('sessionCartId')) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID()

        //Clone the req headers
        const newRequestHeaders = new Headers(request.headers)
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders
          }
        })

        // Set newly generated sessionCartId in the response cookie
        response.cookies.set('sessionCartId', sessionCartId)

        return response
      } else {
        return true
      }
    }
  },

} satisfies NextAuthConfig



export const { handlers, auth, signIn, signOut } = NextAuth(config)

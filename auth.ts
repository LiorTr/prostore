// auth.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge'
import type { NextAuthConfig } from 'next-auth'

export const config = {
  pages: {
    signIn: '/signIn',
    error: '/signIn',
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const creds = credentials as { email: string; password: string }

        const user = await prisma.user.findFirst({
          where: { email: creds.email },
        })

        if (user && user.password) {
          const isMatch = compareSync(creds.password, user.password)
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }

        return null
      }

    })],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.name = user.name ?? user.email?.split('@')[0]
        token.email = user.email
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: any) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

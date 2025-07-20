import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'

export const config = {
  providers: [],
  callbacks: {},
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig

export const { auth } = NextAuth(config)
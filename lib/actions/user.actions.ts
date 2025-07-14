'use server'

import { signInFormSchema, signUpFormSchema } from "../validators"
import { signIn, signOut } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { hashSync } from "bcrypt-ts-edge"
import { prisma } from "@/db/prisma"
import { ZodError } from "zod"
import { formatError } from "../utils"
import { redirect } from "next/navigation"

// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    const callbackUrl = (formData.get('callbackUrl') as string) || '/'

    const res = await signIn('credentials', {
      redirect: false,
      email: user.email,
      password: user.password,
    })

    if (res?.error) {
      return { success: false, message: res.error }
    }

    // Redirect the user after successful sign in
    redirect(callbackUrl)
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: 'Invalid email or password' }
  }
}

// Sign user out
export async function signOutUser() {
  await signOut()
}

// Sign user up
export async function signUpUser(prev: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    })

    const plainPassword = user.password
    user.password = hashSync(user.password, 10)

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    })

    // Sign in the user immediately after successful registration
    await signIn('credentials', {
      redirect: false,
      email: user.email,
      password: plainPassword,
    })

    // Redirect to home or another page after sign up and sign in
    redirect('/')
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    if (error instanceof ZodError) {
      console.error('Zod validation error:', error.flatten())
    } else {
      console.error('Signup error:', error)
    }

    return { success: false, message: formatError(error) }
  }
}

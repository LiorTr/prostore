'use server'

import { signInFormSchema } from "../validators"
import { signIn } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect } from "next/navigation"

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

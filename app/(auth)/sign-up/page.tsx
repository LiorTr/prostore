import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import React from 'react'
import Logo from '@/public/images/logo.svg'
import { APP_NAME } from '@/lib/constants'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import SignUpForm from './credentials-signup-form'

export const metadata: Metadata = {
  title: 'Sign Up',
}


export default async function SignUpPage(props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) {

  const { callbackUrl } = await props.searchParams
  const session = await auth()

  if (session) {
    redirect(callbackUrl || '/')
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
          <Link href='/' className='flex-center'>
            <Image src={Logo} width={100} height={100} alt={`${APP_NAME} logo`} priority />
          </Link>
          <CardTitle className='text-center'>Create account</CardTitle>
          <CardDescription className='text-center'>Enter your information below to sign up</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}

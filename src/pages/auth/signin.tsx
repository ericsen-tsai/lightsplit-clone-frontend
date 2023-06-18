/* eslint-disable react/jsx-pascal-case */
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next'
import { getProviders, signIn } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'

import { Button, Icons } from '@/components'
import { authOptions } from '../api/auth/[...nextauth]'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/' } }
  }

  const providers = await getProviders()

  return {
    props: { providers: providers ?? [] },
  }
}

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="container grid place-content-center h-full min-h-screen">
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <Button onClick={() => { void signIn(provider.id) }}>
            <Icons.google className="h-5 w-5 mr-2" />
            Sign in with
            {' '}
            {provider.name}
          </Button>
        </div>
      ))}
    </div>
  )
}

import Head from 'next/head'
import { Button, ThemeToggle } from '@/components'
import { signIn, signOut, useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { type GetServerSidePropsContext } from 'next'

import Layout from '@/layout'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  return {
    props: {
      session,
    },
  }
}

function Home() {
  const { data: session } = useSession()
  return (
    <>
      <Head>
        <title>Lightsplit Clone</title>
        <meta name="description" content="Lightsplit Clone Frontend" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <Layout>
        <main className="flex flex-col items-center justify-center">
          {session ? (
            <Button
              onClick={() => {
                void signOut()
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => {
                void signIn()
              }}
            >
              Login
            </Button>
          )}
        </main>
      </Layout>

    </>
  )
}

export default Home

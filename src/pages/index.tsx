import Head from 'next/head'
import { signIn, useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { type GetServerSidePropsContext } from 'next'

import { Button, Typography } from '@/components'
import { GroupsGrid } from '@/containers'
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
      <main className="flex flex-col w-full items-center justify-center">
        {session ? (
          <GroupsGrid />
        ) : (
          <div className="flex items-center flex-col justify-center mt-[40vh]">
            <Button
              onClick={() => {
                void signIn()
              }}
            >
              Login
            </Button>
            <Typography>
              You have to login to see your groups
            </Typography>
          </div>
        )}
      </main>

    </>
  )
}

export default Home

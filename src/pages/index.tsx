import Head from 'next/head'
import { signIn, useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { type GetServerSidePropsContext } from 'next'
import { createServerSideHelpers } from '@trpc/react-query/server'
import superjson from 'superjson'

import { createInnerTRPCContext } from '@/server/api/trpc'
import { Button, Typography } from '@/components'
import { GroupsGrid } from '@/containers'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { appRouter } from '@/server/api/root'
import { api } from '@/utils/api'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  let helpers

  if (session) {
    helpers = createServerSideHelpers({
      router: appRouter,
      ctx: createInnerTRPCContext({ session }),
      transformer: superjson,
    })

    await helpers.group.getGroups.prefetch()
  }
  return {
    props: {
      session,
      ...session ? { trpcState: helpers?.dehydrate() } : {},
    },
  }
}

function Home() {
  const { data: session } = useSession()
  const groupsData = api.group.getGroups.useQuery(undefined, {
    enabled: !!session,
  })
  return (
    <>
      <Head>
        <title>Lightsplit Clone</title>
        <meta name="description" content="Lightsplit Clone Frontend" />
        <link rel="icon" href="/icon.svg" />
      </Head>
      <main className="flex w-full flex-col items-center justify-center">
        {session ? (
          <GroupsGrid groups={(groupsData.data && !('error' in groupsData.data)) ? groupsData.data : []} />
        ) : (
          <div className="mt-[40vh] flex flex-col items-center justify-center">
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

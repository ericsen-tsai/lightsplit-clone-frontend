import { useRouter } from 'next/router'

import { GroupMemberForm } from '@/containers'
import { type GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from '@/server/api/root'
import { createInnerTRPCContext } from '@/server/api/trpc'
import superjson from 'superjson'
import { authOptions } from '@/server/auth'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  })

  await helpers.member.getMembers.prefetch({ groupId: (context?.params?.id || '') as string })

  return {
    props: {
      session,
      ...session ? { trpcState: helpers?.dehydrate() } : {},
    },
  }
}

function GroupMember() {
  const router = useRouter()

  return (
    <GroupMemberForm isEdit={Boolean(router.query.isEdit)} />
  )
}

export default GroupMember

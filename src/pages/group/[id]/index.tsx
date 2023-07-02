import { Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Typography,
  SelectSeparator,
  Button,
} from '@/components'
import { useRouter } from 'next/router'

import { GroupDashboardTabs } from '@/containers'
import { type GetServerSidePropsContext } from 'next'
import superjson from 'superjson'
import { authOptions } from '@/server/auth'
import { getServerSession } from 'next-auth'
import { appRouter } from '@/server/api/root'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { createInnerTRPCContext } from '@/server/api/trpc'
import { api } from '@/utils/api'
import { useSession } from 'next-auth/react'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  const groupId = context.params?.id as string
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  })

  await helpers.group.getGroup.prefetch({ groupId })
  await helpers.member.getMembers.prefetch({ groupId })
  await helpers.record.getRecords.prefetch({ groupId })

  return {
    props: {
      session,
      trpcState: helpers?.dehydrate(),
    },
  }
}

function Group() {
  const router = useRouter()
  const groupId = router.query.id as string
  const { data: session } = useSession()
  const group = api.group.getGroup.useQuery({
    groupId,
  })
  const members = api.member.getMembers.useQuery({
    groupId,
  })
  const records = api.record.getRecords.useQuery({
    groupId,
  })

  const groupData = (group.data && !('error' in group.data)) ? group.data : undefined
  const membersData = (members.data && !('error' in members.data)) ? members.data : []
  const recordsData = (records.data && !('error' in records.data)) ? records.data : []
  const yourMemberId = membersData.find((m) => m.userId === session?.user.userId)?.id || ''

  return (
    <div className="container relative flex max-w-[50rem] flex-col pb-20">
      <div className="flex items-center justify-between">
        <Typography variant="h3">{groupData?.name || ''}</Typography>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1">
            <Settings />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                void router.push(`/group/${router.query.id as string}/info`)
              }}
              className="cursor-pointer"
            >
              Edit Info
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                void router.push({
                  pathname: `/group/${router.query.id as string}/member`,
                  query: { isEdit: true },
                })
              }}
              className="cursor-pointer"
            >
              Edit Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Typography variant="h4" className="mt-4 text-primary/50">
        {groupData?.note || ''}
      </Typography>
      <SelectSeparator className="mt-5 bg-primary/20" />
      <GroupDashboardTabs members={membersData} records={recordsData} yourMemberId={yourMemberId} />
      <SelectSeparator className="mt-5 bg-primary/20" />
      <div className="fixed bottom-10 left-1/2 flex w-[calc(100vw-8rem)] -translate-x-1/2 justify-center gap-3 sm:w-full">
        <Button
          type="button"
          className="backdrop-blur-xl"
          variant="outline"
          onClick={() => {
            void router.push(`/group/${router.query.id as string}/record/new`)
          }}
        >
          Add Record
        </Button>
      </div>
    </div>
  )
}

export default Group

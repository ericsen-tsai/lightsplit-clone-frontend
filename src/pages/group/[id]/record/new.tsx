import { RecordForm } from '@/containers'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'

import { type FormSchema } from '@/containers/RecordForm'
import { useToast } from '@/components'
import { authOptions } from '@/server/auth'
import { getServerSession } from 'next-auth'
import { createServerSideHelpers } from '@trpc/react-query/server'
import superjson from 'superjson'
import { createInnerTRPCContext } from '@/server/api/trpc'
import { appRouter } from '@/server/api/root'
import { type GetServerSidePropsContext } from 'next'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  const groupId = context.params?.id as string
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  })

  await helpers.member.getMembers.prefetch({ groupId })
  return {
    props: {
      session,
      trpcState: helpers?.dehydrate(),
    },
  }
}

function RecordNew() {
  const router = useRouter()
  const { toast } = useToast()
  const utils = api.useContext()
  const groupId = router.query.id as string
  const members = api.member.getMembers.useQuery({ groupId })

  const membersData = (members.data && !('error' in members.data)) ? members.data : []
  const createRecord = api.record.createRecord.useMutation({
    onSuccess: async () => {
      await utils.record.getRecords.invalidate({ groupId })
    },
  })

  const handleCreate = async (rd: FormSchema) => {
    await createRecord.mutateAsync({
      recordData: {
        ...rd,
        type: 'expense',
        groupId,
        currency: 'TWD',
      },
      groupId,
    })
    void router.push(`/group/${groupId}`)
    toast({
      description: 'Record created successfully!',
    })
  }

  return <RecordForm members={membersData} handleCreate={handleCreate} />
}

export default RecordNew

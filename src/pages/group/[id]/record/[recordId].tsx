import { useRouter } from 'next/router'
import { RecordForm } from '@/containers'
import { type GetServerSidePropsContext } from 'next'
import { authOptions } from '@/server/auth'
import { getServerSession } from 'next-auth'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from '@/server/api/root'
import { createInnerTRPCContext } from '@/server/api/trpc'
import superjson from 'superjson'
import { api } from '@/utils/api'

import { type FormSchema } from '@/containers/RecordForm'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  const recordId = context.params?.recordId as string
  const groupId = context.params?.id as string
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  })

  await helpers.record.getRecord.prefetch({ groupId, recordId })
  await helpers.member.getMembers.prefetch({ groupId })
  return {
    props: {
      session,
      trpcState: helpers?.dehydrate(),
    },
  }
}

function RecordUpdate() {
  const router = useRouter()
  const utils = api.useContext()
  const groupId = router.query.id as string
  const recordId = router.query.recordId as string

  const record = api.record.getRecord.useQuery({ groupId, recordId })
  const members = api.member.getMembers.useQuery({ groupId })

  const recordData = (record.data && !('error' in record.data)) ? record.data : undefined
  const membersData = (members.data && !('error' in members.data)) ? members.data : []

  const updateRecord = api.record.updateRecord.useMutation({
    onSuccess: () => {
      void utils.record.getRecord.invalidate({ groupId, recordId })
    },
  })

  const deleteRecord = api.record.deleteRecord.useMutation({
    onSuccess: () => {
      void utils.record.getRecords.invalidate({ groupId })
    },
  })

  const handleUpdate = async (rd: FormSchema) => {
    await updateRecord.mutateAsync({
      groupId,
      recordId,
      recordData: {
        ...rd, type: 'expense', currency: 'TWD', groupId,
      },
    })
    void router.push(`/group/${groupId}`)
  }

  const handleDelete = async () => {
    await deleteRecord.mutateAsync({ groupId, recordId })
    void router.push(`/group/${groupId}`)
  }

  return (
    <RecordForm
      isEdit
      members={membersData}
      recordDefaultValues={recordData}
      handleDelete={handleDelete}
      handleUpdate={handleUpdate}
    />
  )
}

export default RecordUpdate

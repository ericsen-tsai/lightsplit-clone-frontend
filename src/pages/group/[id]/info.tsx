import { useSession } from 'next-auth/react'
import superjson from 'superjson'
import { getServerSession } from 'next-auth'
import { type GetServerSidePropsContext } from 'next'
import { createServerSideHelpers } from '@trpc/react-query/server'

import { GroupForm } from '@/containers'
import { type FormSchema } from '@/containers/GroupForm'
import { createInnerTRPCContext } from '@/server/api/trpc'
import { appRouter } from '@/server/api/root'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import { useToast } from '@/components'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  const groupId = context.params?.id as string
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  })

  await helpers.group.getGroup.prefetch({ groupId })
  return {
    props: {
      session,
      trpcState: helpers?.dehydrate(),
    },
  }
}

function GroupEdit() {
  const { toast } = useToast()
  const utils = api.useContext()
  const { data: session } = useSession()
  const router = useRouter()
  const groupId = router.query.id as string
  const group = api.group.getGroup.useQuery({ groupId })

  const updateGroup = api.group.updateGroup.useMutation({
    onSuccess: async () => {
      await utils.group.getGroup.invalidate({ groupId })
    },
  })

  const deleteGroup = api.group.deleteGroup.useMutation({
    onSuccess: async () => {
      await utils.group.getGroups.invalidate()
    },
  })

  const handleUpdate = async (data: FormSchema) => {
    if (!session?.user.userId) {
      console.error('something is wrong')
      return
    }
    await updateGroup.mutateAsync({ ...data, owner: session?.user.userId, groupId })
    void router.push(`/group/${groupId}`)
    toast({
      description: 'Group updated successfully!',
    })
  }

  const handleDelete = () => {
    deleteGroup.mutate({ groupId })
    void router.push('/')
    toast({
      description: 'Group deleted successfully!',
    })
  }

  return (
    <GroupForm
      isEdit
      groupDefaultValues={
        (group.data && !('error' in (group.data)))
          ? {
            note: group.data.note,
            name: group.data.name,
            primaryCurrency: group?.data.primaryCurrency,
            publicPermission: group?.data.publicPermission,
          }
          : undefined
      }
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
    />
  )
}

export default GroupEdit

import { useRouter } from 'next/router'

import { GroupMemberForm } from '@/containers'
import { type GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { appRouter } from '@/server/api/root'
import { createInnerTRPCContext } from '@/server/api/trpc'
import superjson from 'superjson'
import { authOptions } from '@/server/auth'
import { api } from '@/utils/api'

import { type UpdateMembersPayload } from '@/utils/externalApi/member'
import { type Member } from '@/types'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }),
    transformer: superjson,
  })

  await helpers.member.getMembers.prefetch({
    groupId: (context?.params?.id || '') as string,
  })

  return {
    props: {
      session,
      ...(session ? { trpcState: helpers?.dehydrate() } : {}),
    },
  }
}

const hasMemberId = (member: {
  name: string
  permission: 'edit' | 'view'
  id?: string
}): member is { name: string, permission: 'edit' | 'view', id: string } => !!member.id

const createUpdateUsersPayload = ({
  previousMembers,
  currentMembers,
}: {
  previousMembers: Member[]
  currentMembers: { name: string, permission: 'edit' | 'view', id?: string }[]
}): UpdateMembersPayload => {
  const toCreateMembers = currentMembers
    .filter((member) => !member.id)
    .map((member) => ({ name: member.name, permission: member.permission }))
  const toUpdateMembers = currentMembers
    .filter(hasMemberId)
    .filter(
      (member) => !!previousMembers.find(
        (previousMember) => previousMember.id === member.id,
      ),
    )
  const toDeleteMembers = previousMembers
    .filter(hasMemberId)
    .filter(
      (member) => !currentMembers.find((currentMember) => currentMember.id === member.id),
    )
    .map((member) => ({ id: member.id }))

  return {
    create: toCreateMembers,
    update: toUpdateMembers,
    delete: toDeleteMembers,
  }
}

function GroupMember() {
  const utils = api.useContext()
  const router = useRouter()
  const groupId = router.query.id as string
  const members = api.member.getMembers.useQuery({
    groupId,
  })
  const updateMembers = api.member.updateMembers.useMutation({
    onSuccess: () => {
      void utils.member.getMembers.invalidate({ groupId })
    },
    onError: (res) => {
      console.error(res)
    },
  })
  const membersData = (members.data && !('error' in members.data)) ? members.data : []

  const handleUpdate = async (
    newMembers: { name: string, permission: 'edit' | 'view', id?: string }[],
  ) => {
    const updateUsersPayload = createUpdateUsersPayload({
      previousMembers: membersData,
      currentMembers: newMembers,
    })

    void await updateMembers.mutateAsync({
      groupId,
      membersData: updateUsersPayload,
    })

    void router.push(`/group/${groupId}`)
  }

  return (
    <GroupMemberForm
      isEdit={Boolean(router.query.isEdit)}
      handleUpdate={handleUpdate}
      members={membersData}
    />
  )
}

export default GroupMember

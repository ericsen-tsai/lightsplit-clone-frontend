import { z } from 'zod'
import { type Member, memberSchema } from '@/types'
import fetcher from './fetcher'

export const getMembers = async ({ token, groupId }: { token: string, groupId: string }) => {
  const res = await fetcher<Member[]>({
    endpoint: `/group/${groupId}/members`,
    token,
    options: {
      method: 'GET',
    },
  })
  return res
}

export const updateMembersPayloadSchema = z.object({
  create: z.array(memberSchema.omit({
    userId: true, id: true, primaryBalance: true, balances: true,
  })),
  update: z.array(memberSchema.omit({ userId: true, primaryBalance: true, balances: true })),
  delete: z.array(memberSchema.pick({ id: true })),
})

export type UpdateMembersPayload = z.infer<typeof updateMembersPayloadSchema>

export const updateMembers = async ({
  token,
  groupId,
  membersData,
}: {
  token: string
  groupId: string
  membersData: UpdateMembersPayload
}) => {
  const res = await fetcher<Member[]>({
    endpoint: `/group/${groupId}/members`,
    token,
    data: membersData,
    options: {
      method: 'POST',
    },
  })
  return res
}

import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { memberAPI } from '@/utils/externalApi'
import { updateMembersPayloadSchema } from '@/utils/externalApi/member'

// eslint-disable-next-line import/prefer-default-export
export const memberRouter = createTRPCRouter({
  getMembers: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const token = ctx.session.user.accessToken
      const res = await memberAPI.getMembers({ token, groupId: input.groupId })
      return res
    }),
  updateMembers: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        membersData: updateMembersPayloadSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const token = ctx.session.user.accessToken
      const { groupId, membersData } = input
      const res = await memberAPI.updateMembers({ token, groupId, membersData })
      if ('error' in res) {
        return null
      }
      return res
    }),
})

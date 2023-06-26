import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { groupAPI } from '@/utils/externalApi'
import { groupSchema } from '@/types'

// eslint-disable-next-line import/prefer-default-export
export const groupRouter = createTRPCRouter({
  getGroups: protectedProcedure.query(async ({ ctx }) => {
    const token = ctx.session.user.accessToken
    const res = await groupAPI.getGroups({ token })
    if ('error' in res) {
      return []
    }
    return res
  }),
  getGroup: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const token = ctx.session.user.accessToken
      const res = await groupAPI.getGroup({ token, groupId: input.groupId })
      if ('error' in res) {
        return {}
      }
      return res
    }),
  createGroup: protectedProcedure
    .input(
      groupSchema.omit({
        id: true,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const token = ctx.session.user.accessToken
      const res = await groupAPI.createGroup({ token, groupData: input })
      if ('error' in res) {
        return {}
      }
      return res
    }),
  updateGroup: protectedProcedure
    .input(
      groupSchema
        .omit({
          id: true,
        })
        .merge(z.object({ groupId: z.string() })),
    )
    .mutation(async ({ input, ctx }) => {
      const token = ctx.session.user.accessToken
      const { groupId, ...groupData } = input
      const res = await groupAPI.updateGroup({ token, groupData, groupId })
      if ('error' in res) {
        return {}
      }
      return res
    }),
  deleteGroup: protectedProcedure
    .input(
      z.object({ groupId: z.string() }),
    )
    .mutation(async ({ input, ctx }) => {
      const token = ctx.session.user.accessToken
      const { groupId } = input
      const res = await groupAPI.deleteGroup({ token, groupId })
      return res
    }),
})

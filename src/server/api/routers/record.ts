import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { recordAPI } from '@/utils/externalApi'
import { balanceRecordSchema } from '@/types'

// eslint-disable-next-line import/prefer-default-export
export const recordRouter = createTRPCRouter({
  getRecords: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const token = ctx.session.user.accessToken
      const res = await recordAPI.getRecords({ token, groupId: input.groupId })
      return res
    }),
  getRecord: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        recordId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const token = ctx.session.user.accessToken
      const res = await recordAPI.getRecord({
        token,
        groupId: input.groupId,
        recordId: input.recordId,
      })
      return res
    }),
  createRecord: protectedProcedure
    .input(
      z.object({
        recordData: balanceRecordSchema.omit({
          id: true,
        }),
        groupId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const token = ctx.session.user.accessToken
      const res = await recordAPI.createRecord({
        token,
        recordData: input.recordData,
        groupId: input.groupId,
      })
      return res
    }),
  updateRecord: protectedProcedure
    .input(
      z.object({
        recordData: balanceRecordSchema.omit({
          id: true,
        }),
        groupId: z.string(),
        recordId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const token = ctx.session.user.accessToken
      const { recordId, groupId, recordData } = input
      const res = await recordAPI.updateRecord({
        token, recordData, recordId, groupId,
      })
      return res
    }),
  deleteRecord: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        recordId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const token = ctx.session.user.accessToken
      const { recordId, groupId } = input
      const res = await recordAPI.deleteRecord({ token, recordId, groupId })
      return res
    }),
})

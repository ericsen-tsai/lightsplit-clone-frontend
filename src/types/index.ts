import { z } from 'zod'

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  owner: z.number(),
  note: z.string().optional(),
  publicPermission: z.union([
    z.literal('limited'),
    z.literal('public'),
    z.literal('private'),
  ]),
  primaryCurrency: z.literal('TWD'),
})

export type Group = z.infer<typeof groupSchema>

export const balanceRecordSchema = z.object({
  id: z.string(),
  group: z.string(),
  what: z.string(),
  amount: z.number(),
  type: z.union([
    z.literal('expense'),
    z.literal('income'),
    z.literal('transfer'),
  ]),
  currency: z.literal('TWD'),
  exchangeRate: z.number().optional(),
  note: z.string().optional(),
  isEqualSplit: z.boolean().optional(),
  fromMembers: z.array(
    z.object({
      amount: z.number(),
      memberId: z.string(),
    }),
  ),
  toMembers: z.array(
    z.object({
      amount: z.number(),
      memberId: z.string(),
    }),
  ),
})

export type BalanceRecord = z.infer<typeof balanceRecordSchema>

export const memberSchema = z.object({
  id: z.string(),
  userId: z.number(),
  name: z.string(),
  permission: z.union([z.literal('edit'), z.literal('view')]),
  primaryBalance: z.number(),
})

export type Member = z.infer<typeof memberSchema>

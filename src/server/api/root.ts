import { createTRPCRouter } from '@/server/api/trpc'
import { exampleRouter } from './routers/example'
import { groupRouter } from './routers/group'
import { memberRouter } from './routers/member'
import { recordRouter } from './routers/record'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  group: groupRouter,
  member: memberRouter,
  record: recordRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

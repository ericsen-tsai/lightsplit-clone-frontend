import { type GetServerSidePropsContext } from 'next'
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type DefaultUser,
} from 'next-auth'
import { type DefaultJWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'

import { env } from '@/env.mjs'
import { accountAPI, tokenHelper } from '@/utils/externalApi'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      accessToken: string
      userId: number
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  interface User extends DefaultUser{
    // ...other properties
    // role: UserRole;
    refreshToken?: string
    accessToken?: string
    userId?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string
    refreshToken?: string
    userId?: number
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        accessToken: token.accessToken,
        userId: token.userId,
      },
    }),
    async signIn({ user: userArgs, account }) {
      let accessToken = ''
      let refreshToken = ''

      // when super token is provided
      if (env.EXTERNAL_API_SUPER_TOKEN) {
        accessToken = env.EXTERNAL_API_SUPER_TOKEN
      } else {
        const googleLoginRes = await accountAPI.syncGoogleLogin({
          credential: account?.id_token || '',
        })
        if ('error' in googleLoginRes) {
          return false
        }
        accessToken = googleLoginRes.accessToken
        refreshToken = googleLoginRes.refreshToken
      }

      const getUserRes = await accountAPI.getUser({ token: accessToken })
      if ('error' in getUserRes) {
        return false
      }

      // eslint-disable-next-line no-param-reassign
      userArgs.refreshToken = refreshToken
      // eslint-disable-next-line no-param-reassign
      userArgs.accessToken = accessToken
      // eslint-disable-next-line no-param-reassign
      userArgs.userId = getUserRes.id

      if (userArgs) {
        return true
      }
      return false
    },
    async jwt({ token, user }) {
      const newToken = { ...token }

      if (user) {
        newToken.accessToken = user.accessToken
        newToken.refreshToken = user.refreshToken
        newToken.userId = user.userId
      }

      const { refreshToken, accessToken } = token

      const { accessToken: newAccessToken } = await tokenHelper({
        refreshToken: refreshToken || '',
        accessToken: accessToken || '',
      })

      newToken.accessToken = newAccessToken
      return newToken
    },
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: '/auth/signin',
  },
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) => getServerSession(ctx.req, ctx.res, authOptions)

import fetcher from './fetcher'

export const syncGoogleLogin = async ({
  credential,
}: {
  credential: string
}) => {
  const res = await fetcher<{
    accessToken: string
    refreshToken: string
    access: string
    refresh: string
  }>({
    endpoint: '/account/google/token',
    data: { credential },
    options: {
      method: 'POST',
    },
  })
  return res
}

export const refreshAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string
}) => {
  const res = await fetcher<{
    accessToken: string
  }>({
    endpoint: '/account/token/refresh',
    data: { refresh: refreshToken },
    options: {
      method: 'POST',
    },
  })
  return res
}

export const validateAccessToken = async ({
  accessToken,
}: {
  accessToken: string
}) => {
  const res = await fetcher<Record<string, never>>({
    endpoint: '/account/token/verify',
    data: { token: accessToken },
    options: {
      method: 'POST',
    },
  })
  return res
}

export const getUser = async ({ token }: { token: string }) => {
  const res = await fetcher<{
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
  }>({
    endpoint: '/account/user',
    token,
    options: {
      method: 'GET',
    },
  })
  return res
}

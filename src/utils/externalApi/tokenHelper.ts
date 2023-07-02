import { refreshAccessToken, validateAccessToken } from './account'

const tokenHelper = async ({
  accessToken,
  refreshToken,
}: {
  accessToken: string
  refreshToken: string
}) => {
  const res = await validateAccessToken({ accessToken })
  if (!('error' in res)) {
    return { accessToken, refreshToken }
  }
  const refreshAccessTokenRes = await refreshAccessToken({ refreshToken })
  if (!('error' in refreshAccessTokenRes)) {
    return { accessToken: refreshAccessTokenRes.accessToken, refreshToken }
  }

  return { accessToken: '', refreshToken }
}

export default tokenHelper

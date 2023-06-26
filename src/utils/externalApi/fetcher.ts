import { camelizeKeys, decamelizeKeys } from 'humps'

import { baseExternalUrl } from './constants'

export type FetcherResponse<T> = T | { error: string }

const fetcher = async <ResponseSchema = Record<string, never>>({
  endpoint,
  data,
  token,
  options,
  errorMessage,
}: {
  endpoint: string
  data?: Record<string, any>
  token?: string
  options?: RequestInit
  errorMessage?: string
}): Promise<FetcherResponse<ResponseSchema>> => {
  const response = await fetch(`${baseExternalUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...data ? { body: JSON.stringify(decamelizeKeys(data)) } : {},
    ...options,
  })
  if (!response.ok) {
    const resError = await response.text()
    return { error: errorMessage || resError }
  }
  if (response.status === 204) {
    return {} as Record<string, never> as FetcherResponse<ResponseSchema>
  }
  return camelizeKeys(await response.json()) as ResponseSchema
}

export default fetcher

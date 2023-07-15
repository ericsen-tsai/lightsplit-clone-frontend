import { type BalanceRecord } from '@/types'
import fetcher from './fetcher'

export const getRecords = async ({ token, groupId }: { token: string, groupId: string }) => {
  const res = await fetcher<BalanceRecord[]>({
    endpoint: `/group/${groupId}/record`,
    token,
    options: {
      method: 'GET',
    },
  })
  return res
}

export const getRecord = async ({
  token,
  groupId,
  recordId,
}: {
  token: string
  groupId: string
  recordId: string
}) => {
  const res = await fetcher<BalanceRecord>({
    endpoint: `/group/${groupId}/record/${recordId}`,
    token,
    options: {
      method: 'GET',
    },
  })
  return res
}

export const createRecord = async ({
  token,
  groupId,
  recordData,
}: {
  token: string
  groupId: string
  recordData: Omit<BalanceRecord, 'id'>
}) => {
  const res = await fetcher<BalanceRecord>({
    endpoint: `/group/${groupId}/record`,
    token,
    data: recordData,
    options: {
      method: 'POST',
    },
  })
  return res
}

export const updateRecord = async ({
  token,
  groupId,
  recordId,
  recordData,
}: {
  token: string
  groupId: string
  recordId: string
  recordData: Omit<BalanceRecord, 'id'>
}) => {
  const res = await fetcher<BalanceRecord>({
    endpoint: `/group/${groupId}/record/${recordId}`,
    token,
    data: recordData,
    options: {
      method: 'PATCH',
    },
  })
  return res
}

export const deleteRecord = async ({
  token,
  groupId,
  recordId,
}: {
  token: string
  groupId: string
  recordId: string
}) => {
  try {
    const res = await fetcher<null>({
      endpoint: `/group/${groupId}/record/${recordId}`,
      token,
      options: {
        method: 'DELETE',
      },
    })
    return res || {}
  } catch (error) {
    return {}
  }
}

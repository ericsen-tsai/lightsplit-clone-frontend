import { type Group } from '@/types'
import fetcher from './fetcher'

export const getGroups = async ({ token }: { token: string }) => {
  const res = await fetcher<Group[]>({
    endpoint: '/group',
    token,
    options: {
      method: 'GET',
    },
  })
  return res
}

export const getGroup = async ({
  token,
  groupId,
}: {
  token: string
  groupId: string
}) => {
  const res = await fetcher<Group>({
    endpoint: `/group/${groupId}`,
    token,
    options: {
      method: 'GET',
    },
  })
  return res
}

export const createGroup = async ({
  token,
  groupData,
}: {
  token: string
  groupData: Omit<Group, 'id'>
}) => {
  const res = await fetcher<Group>({
    endpoint: '/group',
    token,
    data: groupData,
    options: {
      method: 'POST',
    },
  })
  return res
}

export const updateGroup = async ({
  token,
  groupId,
  groupData,
}: {
  token: string
  groupId: string
  groupData: Omit<Group, 'id'>
}) => {
  const res = await fetcher<Group>({
    endpoint: `/group/${groupId}`,
    token,
    data: groupData,
    options: {
      method: 'PATCH',
    },
  })
  return res
}

export const deleteGroup = async ({
  token,
  groupId,
}: {
  token: string
  groupId: string
}) => {
  const res = await fetcher<null>({
    endpoint: `/group/${groupId}`,
    token,
    options: {
      method: 'DELETE',
    },
  })
  return res
}

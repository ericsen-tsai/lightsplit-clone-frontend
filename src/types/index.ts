type Group = {
  id: string
  name: string
  owner: number
  note: string
  publicPermission: 'limited'| 'public'| 'private'
  primaryCurrency: 'TWD'
}

type BalanceRecord = {
  id: string
  group: string
  what: string
  amount: number
  type: 'expense' | 'income' | 'transfer'
  currency: 'TWD'
  exchangeRate?: number
  note?: string
  isEqualSplit?: boolean
  fromMembers: Array<{ amount: number, member: string }>
  toMembers: Array<{ amount: number, member: string }>
}

type Member = {
  id: string
  userId: number
  name: string
  permission: 'edit' | 'view'
  primaryBalance: number
}

export type { Group, BalanceRecord, Member }

import { type Group, type Member, type BalanceRecord } from '@/types'

const fakeGroups: Group[] = [
  {
    id: '1abc23de4',
    name: 'Group Alpha',
    owner: 1527,
    note: 'This is the Alpha group.',
    publicPermission: 'public',
    primaryCurrency: 'TWD',
  },
  {
    id: '5fg6h78i9',
    name: 'Group Bravo',
    owner: 1527,
    note: 'This is the Bravo group.',
    publicPermission: 'public',
    primaryCurrency: 'TWD',
  },
  {
    id: '0jk1lmn23',
    name: 'Group Charlie',
    owner: 1527,
    note: 'This is the Charlie group.',
    publicPermission: 'public',
    primaryCurrency: 'TWD',
  },
]

const fakeMembers: Member[] = [
  {
    id: 'm1a2b3',
    userId: 1527,
    name: 'Ericsen Tsai',
    permission: 'edit',
    primaryBalance: 500, // Grocery: +250, Utilities: +150, Dinner: +100
  },
  {
    id: 'm4b5c6',
    userId: 1528,
    name: 'Jane Smith',
    permission: 'view',
    primaryBalance: -200, // Grocery: -250, Utilities: -50, Dinner: +100
  },
  {
    id: 'm7c8d9',
    userId: 1529,
    name: 'Alice Johnson',
    permission: 'edit',
    primaryBalance: -300, // Utilities: -100, Dinner: -200
  },
]

const fakeRecords: BalanceRecord[] = [
  {
    id: 'r123',
    group: '1abc23de4',
    what: 'Grocery',
    amount: 250,
    type: 'expense',
    currency: 'TWD',
    note: 'Grocery shopping for group Alpha',
    isEqualSplit: true,
    fromMembers: [{ amount: 250, member: 'm1a2b3' }],
    toMembers: [{ amount: 250, member: 'm4b5c6' }],
  },
  {
    id: 'r789',
    group: '1abc23de4',
    what: 'Utilities',
    amount: 150,
    type: 'expense',
    currency: 'TWD',
    note: 'Utilities for the group Alpha house',
    isEqualSplit: false,
    fromMembers: [{ amount: 150, member: 'm1a2b3' }],
    toMembers: [{ amount: 100, member: 'm7c8d9' }, { amount: 50, member: 'm4b5c6' }],
  },
  {
    id: 'r101',
    group: '1abc23de4',
    what: 'Dinner',
    amount: 200,
    type: 'expense',
    currency: 'TWD',
    note: 'Dinner expense for Group Alpha',
    isEqualSplit: false,
    fromMembers: [{ amount: 100, member: 'm1a2b3' }, { amount: 100, member: 'm4b5c6' }],
    toMembers: [{ amount: 200, member: 'm7c8d9' }],
  },
]

export { fakeGroups, fakeMembers, fakeRecords }

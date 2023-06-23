import { RecordForm } from '@/containers'
import { fakeMembers, fakeRecords } from '@/utils/fakeData'

function RecordInfo() {
  return (
    <RecordForm
      isEdit
      members={fakeMembers}
      recordDefaultValues={{
        what: fakeRecords[0]?.what || '',
        amount: fakeRecords[0]?.amount || 300,
        paidBy: fakeRecords[0]?.fromMembers || [],
        forWhom: fakeRecords[0]?.toMembers || [],
        note: fakeRecords[0]?.note || '',
      }}
    />
  )
}

export default RecordInfo

import { RecordForm } from '@/containers'
import { api } from '@/utils/api'
import { fakeMembers } from '@/utils/fakeData'
import { useRouter } from 'next/router'

import { type FormSchema } from '@/containers/RecordForm'

function RecordNew() {
  const router = useRouter()
  const utils = api.useContext()
  const groupId = router.query.id as string
  const createRecord = api.record.createRecord.useMutation({
    onSuccess: () => {
      void utils.record.getRecords.invalidate({ groupId })
    },
  })

  const handleSubmit = async (rd: FormSchema) => {
    await createRecord.mutateAsync({
      recordData: {
        ...rd,
        type: 'expense',
        group: groupId,
        currency: 'TWD',
      },
      groupId,
    })
    void router.push(`/group/${groupId}`)
  }

  return <RecordForm members={fakeMembers} handleSubmit={handleSubmit} />
}

export default RecordNew

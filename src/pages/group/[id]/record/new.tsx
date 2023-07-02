import { RecordForm } from '@/containers'
import { api } from '@/utils/api'
import { fakeMembers } from '@/utils/fakeData'
import { useRouter } from 'next/router'

import { type FormSchema } from '@/containers/RecordForm'
import { useToast } from '@/components'

function RecordNew() {
  const router = useRouter()
  const { toast } = useToast()
  const utils = api.useContext()
  const groupId = router.query.id as string
  const createRecord = api.record.createRecord.useMutation({
    onSuccess: async () => {
      await utils.record.getRecords.invalidate({ groupId })
    },
  })

  const handleCreate = async (rd: FormSchema) => {
    await createRecord.mutateAsync({
      recordData: {
        ...rd,
        type: 'expense',
        groupId,
        currency: 'TWD',
      },
      groupId,
    })
    void router.push(`/group/${groupId}`)
    toast({
      description: 'Record created successfully!',
    })
  }

  return <RecordForm members={fakeMembers} handleCreate={handleCreate} />
}

export default RecordNew

import { RecordForm } from '@/containers'
import { fakeMembers } from '@/utils/fakeData'

function RecordNew() {
  return (
    <RecordForm
      members={fakeMembers}
    />
  )
}

export default RecordNew

import { GroupForm } from '@/containers'

import { type FormSchema } from '@/containers/GroupForm'

function GroupEdit() {
  const test: FormSchema = {
    groupName: '',
    publicPermission: 'limited',
    primaryCurrency: 'TWD',
    note: '',
  }
  return (
    <GroupForm isEdit groupDefaultValues={test} />
  )
}

export default GroupEdit

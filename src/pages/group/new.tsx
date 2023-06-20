import { GroupForm } from '@/containers'

import { type FormSchema } from '@/containers/GroupForm'

function GroupNew() {
  const test: FormSchema = {
    groupName: '',
    publicPermission: 'limited',
    primaryCurrency: 'TWD',
    note: '',
  }
  return (
    <GroupForm isEdit={false} groupDefaultValues={test} />
  )
}

export default GroupNew

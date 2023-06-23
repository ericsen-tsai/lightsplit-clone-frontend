import { useRouter } from 'next/router'

import { GroupMemberForm } from '@/containers'

function GroupMember() {
  const router = useRouter()

  return (
    <GroupMemberForm isEdit={Boolean(router.query.isEdit)} />
  )
}

export default GroupMember

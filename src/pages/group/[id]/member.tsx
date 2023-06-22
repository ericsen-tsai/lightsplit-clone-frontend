import { useRouter } from 'next/router'

import { GroupMemberForm } from '@/containers'

function GroupMember() {
  const router = useRouter()
  console.log(router.query.id, 'router.query.id')

  return (
    <GroupMemberForm />
  )
}

export default GroupMember

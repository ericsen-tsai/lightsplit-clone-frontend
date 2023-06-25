import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { type FormSchema } from '@/containers/GroupForm'
import { GroupForm } from '@/containers'
import { api } from '@/utils/api'

function GroupNew() {
  const utils = api.useContext()
  const { data: session } = useSession()
  const router = useRouter()
  const createGroup = api.group.createGroup.useMutation({
    onSuccess: () => {
      void utils.group.getGroups.invalidate()
    },
    onError: (res) => {
      console.error(res)
    },
  })
  const handleSubmit = async (data: FormSchema) => {
    if (!session?.user.userId) {
      console.error('something is wrong')
      return
    }
    await createGroup.mutateAsync({ ...data, owner: session?.user.userId })
    void router.push('/')
  }
  return (
    <GroupForm handleSubmit={handleSubmit} />
  )
}

export default GroupNew

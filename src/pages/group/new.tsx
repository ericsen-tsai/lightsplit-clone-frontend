import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { type FormSchema } from '@/containers/GroupForm'
import { GroupForm } from '@/containers'
import { api } from '@/utils/api'
import { type Group } from '@/types'

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
  const handleCreate = async (data: FormSchema) => {
    if (!session?.user.userId) {
      console.error('something is wrong')
      return
    }
    const d = (await createGroup.mutateAsync({
      ...data,
      owner: session?.user.userId,
    })) as Awaited<Promise<Group>>
    void router.push(`/group/${d.id}/member`)
  }
  return <GroupForm handleCreate={handleCreate} />
}

export default GroupNew

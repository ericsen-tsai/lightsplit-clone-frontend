import { Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Typography,
  SelectSeparator,
  Button,
} from '@/components'
import { useRouter } from 'next/router'

import { GroupDashboardTabs } from '@/containers'

const groupName = 'This is for test'
const note = 'This is your note'

function Group() {
  const router = useRouter()

  return (
    <div className="container relative flex max-w-[50rem] flex-col pb-20">
      <div className="flex items-center justify-between">
        <Typography variant="h3">{groupName}</Typography>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1">
            <Settings />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                void router.push(`/group/${router.query.id as string}/info`)
              }}
              className="cursor-pointer"
            >
              Edit Info
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                void router.push({
                  pathname: `/group/${router.query.id as string}/member`,
                  query: { isEdit: true },
                })
              }}
              className="cursor-pointer"
            >
              Edit Member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Typography variant="h4" className="mt-4 text-primary/50">
        {note}
      </Typography>
      <SelectSeparator className="mt-5 bg-primary/20" />
      <GroupDashboardTabs />
      <SelectSeparator className="mt-5 bg-primary/20" />
      <div className="fixed bottom-10 left-1/2 flex w-[calc(100vw-8rem)] -translate-x-1/2 justify-center gap-3 sm:w-full">
        <Button
          type="button"
          className="backdrop-blur-xl"
          variant="outline"
          onClick={() => {
            void router.push(`/group/${router.query.id as string}/record/new`)
          }}
        >
          Add Record
        </Button>
      </div>
    </div>
  )
}

export default Group

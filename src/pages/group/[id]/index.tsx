import { Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Typography,
  SelectSeparator,
} from '@/components'
import { useRouter } from 'next/router'

const groupName = 'This is for test'
const note = 'This is your note'

function Group() {
  const router = useRouter()

  return (
    <div className="container flex max-w-[50rem] flex-col">
      <div className="flex items-center justify-between">
        <Typography variant="h3">{groupName}</Typography>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1">
            <Settings />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                void router.push(
                  `/group/${(router.query.id as string)}/info`,
                )
              }}
              className="cursor-pointer"
            >
              Edit Info
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                void router.push(
                  `/group/${(router.query.id as string)}/member`,
                )
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
    </div>
  )
}

export default Group

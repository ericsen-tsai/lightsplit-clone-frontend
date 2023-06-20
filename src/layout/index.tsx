import { useSession, signOut } from 'next-auth/react'
import { PiggyBank } from 'lucide-react'
import { useRouter } from 'next/router'

import {
  AvatarFallback,
  AvatarImage,
  Avatar,
  ThemeToggle,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components'

type Props = {
  children: React.ReactNode
}

function Layout({ children }: Props) {
  const { data: session, status } = useSession()
  const router = useRouter()
  console.log(session, status)

  return (
    <div className="relative h-full w-full font-sans">
      <header className="fixed left-0 top-0 flex w-full items-center justify-between px-3 py-5 backdrop-blur-md z-[9999]">
        <nav>
          <button
            type="button"
            onClick={() => {
              void router.push('/')
            }}
          >
            <PiggyBank className="h-10 w-10 cursor-pointer rounded-full bg-[#ADDDA5] stroke-black p-1 transition-all duration-500 hover:scale-110 dark:bg-teal-500 dark:stroke-white" />
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger disabled={!session?.user.name}>
              <Avatar>
                <AvatarImage
                  src={session?.user.image || ''}
                  alt={session?.user.name || ''}
                />
                <AvatarFallback className="dark:text-black">UN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => {
                  void signOut()
                }}
                className="cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="container h-full min-h-screen pt-[5rem]">{children}</div>
    </div>
  )
}

export default Layout

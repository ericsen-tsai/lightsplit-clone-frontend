import { useSession } from 'next-auth/react'
import { PiggyBank } from 'lucide-react'
import {
  AvatarFallback, AvatarImage, Avatar, ThemeToggle,
} from '@/components'

type Props = {
  children: React.ReactNode
}

function Layout({ children }: Props) {
  const { data: session, status } = useSession()

  console.log(session, status)

  return (
    <div className="w-full relative">
      <header className="flex justify-between py-5 px-3 items-center fixed top-0 left-0 w-full backdrop-blur-md">
        <nav>
          <PiggyBank className="w-10 h-10 bg-[#ADDDA5] dark:bg-teal-500 dark:stroke-white rounded-full stroke-black p-1 hover:scale-110 transition-all duration-500 cursor-pointer" />
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Avatar>
            <AvatarImage src={session?.user.image || ''} alt={session?.user.name || ''} />
            <AvatarFallback className="dark:text-black">UN</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="container grid place-content-center pt-5 min-h-screen">
        {children}
      </div>
    </div>
  )
}

export default Layout

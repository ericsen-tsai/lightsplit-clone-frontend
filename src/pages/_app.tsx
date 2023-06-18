import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { Inter } from 'next/font/google'

import { api } from '@/utils/api'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <>
    <style jsx global>
      {`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}
    </style>
    <div className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </div>
  </>

)

export default api.withTRPC(MyApp)

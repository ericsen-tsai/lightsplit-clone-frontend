import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { Inter } from 'next/font/google'
import RouteLoadingProgress from 'nextjs-progressbar'
import { ThemeProvider } from 'next-themes'

import { api } from '@/utils/api'
import { Toaster } from '@/components'
import Layout from '@/layout'
import '@/styles/globals.css'

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
          <RouteLoadingProgress color="#55B5A6" />
          <Layout>
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        </SessionProvider>
      </ThemeProvider>
    </div>
  </>

)

export default api.withTRPC(MyApp)

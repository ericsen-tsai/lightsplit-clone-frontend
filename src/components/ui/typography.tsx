/* eslint-disable import/prefer-default-export */
import { cn } from '@/lib/utils'

const typographyClassNames = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
} as const

type Props = {
  variant?: keyof typeof typographyClassNames
  children: React.ReactNode
  className?: string
}

function Typography({ variant = 'p', children, className = '' }: Props) {
  const Element = variant
  return (
    <Element className={cn(typographyClassNames[variant], className)}>
      {children}
    </Element>
  )
}

export { Typography }

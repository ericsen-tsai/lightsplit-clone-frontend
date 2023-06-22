import {
  Typography, Avatar, AvatarFallback, AvatarImage,
} from '@/components'

type Props = {
  avatarUrl?: string
  username: string
  balance: number
  maxBalance: number
  currencyPrefix?: string
}

function BalanceRow({
  avatarUrl,
  username,
  balance,
  maxBalance,
  currencyPrefix = 'NT',
}: Props) {
  const balanceInfo = `${balance >= 0 ? '+' : '-'}${currencyPrefix}$${Math.abs(
    balance,
  ).toLocaleString()}`

  const avatarNode = (
    <div
      className={`flex w-1/2 items-center justify-end gap-3 ${
        balance < 0 ? 'flex-row-reverse pl-3' : 'pr-3'
      }`}
    >
      <Avatar className="hidden sm:inline-block">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback className="dark:text-black">
          {username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <Typography variant="p" className="!mt-0">{username}</Typography>
    </div>
  )

  return (
    <div
      className={`flex items-center justify-center ${balance < 0 ? 'flex-row-reverse' : ''}`}
    >
      {avatarNode}
      <Typography
        variant="p"
        className={`relative !mt-0 flex w-1/2 items-center self-stretch ${
          balance < 0 ? 'justify-end pr-3' : 'justify-start pl-3'
        }`}
      >
        <span className="relative z-10 my-auto">{balanceInfo}</span>
        <span
          className={`absolute top-0 z-0 h-full ${
            balance < 0 ? 'right-0 bg-red-200 dark:bg-red-700' : 'left-0 bg-green-200 dark:bg-green-700'
          }`}
          style={{
            width: `${Math.floor((Math.abs(balance) / maxBalance) * 100)}%`,
          }}
        />
      </Typography>
    </div>
  )
}

export default BalanceRow

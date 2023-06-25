import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  DropdownMenuSeparator,
  Typography,
} from '@/components'
import { type BalanceRecord, type Member } from '@/types'
import { useRouter } from 'next/router'

type RecordInfoRowProps = {
  what: BalanceRecord['what']
  type: BalanceRecord['type']
  fromWho: Member['name'][]
  toWho: Member['name'][]
  amount: BalanceRecord['amount']
  myAmount: number
}

const genRecordDescription = ({
  type,
  fromWho,
  toWho,
  amount,
}: Omit<RecordInfoRowProps, 'what' | 'myAmount'>) => {
  const person = fromWho.length >= 2 ? `${fromWho.length} people` : (fromWho[0] as string)

  if (type === 'transfer') {
    return `${person} transfer NT${amount} to ${toWho[0] as string}`
  }
  return (
    <>
      {`${person} paid`}
      {' '}
      <span
        className={`${
          fromWho.includes('You') ? 'text-red-300 dark:text-red-700' : ''
        }`}
      >
        NT$
        {amount}
      </span>
    </>
  )
}

const getFromWho = ({
  record,
  members,
  yourMemberId,
}: {
  record: BalanceRecord
  members: Member[]
  yourMemberId: string
}) => record.fromMembers.map((member) => {
  if (member.memberId === yourMemberId) return 'You'
  return members.find((m) => m.id === member.memberId)?.name || 'Unknown'
})

const getToWho = ({
  record,
  members,
  yourMemberId,
}: {
  record: BalanceRecord
  members: Member[]
  yourMemberId: string
}) => record.toMembers.map((member) => {
  if (member.memberId === yourMemberId) return 'You'
  return members.find((m) => m.id === member.memberId)?.name || 'Unknown'
})

function RecordInfoRow({
  what,
  type,
  fromWho,
  toWho,
  amount,
  myAmount,
}: RecordInfoRowProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col text-start">
        <Typography variant="h4">{what}</Typography>
        <Typography variant="p" className="!mt-0">
          {genRecordDescription({
            type,
            fromWho,
            toWho,
            amount,
          })}
        </Typography>
      </div>
      <Typography
        variant="h4"
        className={`${
          myAmount > 0
            ? 'bg-green-300 dark:bg-green-700'
            : 'bg-red-300 dark:bg-red-700'
        }`}
      >
        {myAmount
          ? `NT$
        ${Math.abs(myAmount)}`
          : ''}
      </Typography>
    </div>
  )
}

type RecordRowsProps = {
  records: BalanceRecord[]
  members: Member[]
  yourMemberId: string
}

function RecordRows({ records, members, yourMemberId }: RecordRowsProps) {
  const router = useRouter()

  return (
    <Accordion type="single" collapsible className="w-full">
      {records.map((record) => {
        const fromWho = getFromWho({ record, members, yourMemberId })

        const toWho = getToWho({ record, members, yourMemberId })

        const myAmount = [
          ...record.toMembers.map((a) => ({
            ...a,
            amount: a.amount * (record.type === 'transfer' ? 1 : -1),
          })),
        ].find((a) => a.memberId === yourMemberId)?.amount || 0

        return (
          <AccordionItem value={record.id} key={record.id}>
            <AccordionTrigger>
              <RecordInfoRow
                type={record.type}
                what={record.what}
                amount={record.amount}
                fromWho={fromWho}
                toWho={toWho}
                myAmount={myAmount}
              />
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col text-primary/50">
                {fromWho.map((name, ind) => (
                  <Typography variant="p" className="!mt-0" key={name}>
                    {name}
                    {' '}
                    paid NT$
                    {record.fromMembers[ind]?.amount}
                  </Typography>
                ))}
                <DropdownMenuSeparator className="bg-black/30 dark:bg-white/30" />
                {toWho.map((name, ind) => (
                  <Typography variant="p" className="!mt-0" key={name}>
                    {name}
                    {' '}
                    {name === 'you' ? 'owe' : 'owes'}
                    {' '}
                    NT$
                    {record.toMembers[ind]?.amount}
                  </Typography>
                ))}
              </div>

              <div className="mt-5 flex w-full justify-end gap-3">
                <Button
                  type="button"
                  className="w-1/2"
                  onClick={
                  () => {
                    void router.push(`/group/${router.query.id as string}/record/${record.id}`)
                  }
                }
                >
                  Edit
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export default RecordRows

import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Checkbox,
  Typography,
} from '@/components'
import { useRouter } from 'next/router'
import { type Member } from '@/types'
import { useState } from 'react'

const formSchema = z.object({
  what: z.string().min(2, {
    message: 'Item name must be at least 2 characters.',
  }),
  amount: z.number().min(0, {
    message: 'Are you sure you did not lose money?',
  }),
  paidBy: z.array(
    z.object({
      memberId: z.string(),
      amount: z.number(),
    }),
  ),
  forWhom: z.array(
    z.object({
      memberId: z.string(),
      amount: z.number(),
    }),
  ),
  note: z.string(),
})

export type FormSchema = z.infer<typeof formSchema>

type RecordFormPartiesDialogProps = {
  values?: FormSchema['paidBy'] | FormSchema['forWhom']
  onSave: ({
    value,
  }: {
    value: FormSchema['paidBy'] | FormSchema['forWhom']
  }) => void
  members: Member[]
  amount: number
  dialogTitle: string
  open: boolean
  onOpenChange: (val: boolean) => void
}

function RecordFormPartiesDialog({
  values,
  onSave,
  members,
  amount,
  dialogTitle,
  open,
  onOpenChange,
}: RecordFormPartiesDialogProps) {
  const [memberAmounts, setMemberAmounts] = useState<
    { isInvolved: boolean, name: string, amount: number | string, id: string }[]
  >(
    members.map((member) => ({
      isInvolved: !!values?.map((val) => val.memberId).includes(member.id),
      name: member.name,
      amount: values?.find((val) => member.id === val.memberId)?.amount || 0,
      id: member.id,
    })),
  )

  const [showError, setShowError] = useState<boolean>(false)

  const currentTotal = memberAmounts
    .filter((m) => m.isInvolved)
    .reduce((sum, a) => sum + +a.amount, 0)

  const handleSave = () => {
    if (
      currentTotal !== amount
      || memberAmounts.some((a) => a.isInvolved && +a.amount <= 0)
    ) {
      setShowError(true)
      return
    }
    const amountsData = memberAmounts
      .filter((m) => m.isInvolved)
      .map((m) => ({ memberId: m.id, amount: +m.amount }))
    setMemberAmounts((prev) => prev.map((m) => ({ ...m, amount: m.isInvolved ? m.amount : 0 })))
    setShowError(false)
    onSave({ value: amountsData })
    onOpenChange(false)
  }

  const handleSplitEqual = () => {
    const involvedMembers = memberAmounts.filter((m) => m.isInvolved).length
    if (involvedMembers === 0) return
    const equal = Math.floor(amount / involvedMembers)
    let memberLeft = involvedMembers
    setMemberAmounts((prev) => prev.map((m) => {
      if (m.isInvolved) {
        memberLeft -= 1
      }
      const trulyAmount = memberLeft === 0 ? (amount - equal * (involvedMembers - 1)) : equal
      return { ...m, amount: m.isInvolved ? trulyAmount : 0 }
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {values
            ? values
              .map(
                (val) => members.find((m) => m.id === val.memberId)?.name || 'Unknown',
              )
              .join(', ')
            : 'Edit Parties'}
        </Button>
      </DialogTrigger>
      <DialogContent forceMount className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="relative flex flex-col items-center">
          <Typography variant="p" className="!mt-0">
            {`NT$${currentTotal} / NT$${amount || 0}`}
            <span className="ml-5 text-xl">
              {`${(amount || 0) - currentTotal} Left`}
            </span>
          </Typography>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSplitEqual}
            className="absolute bottom-0 right-0"
          >
            Split Equally
          </Button>
        </div>
        {memberAmounts.map((member, ind) => (
          <div
            className="flex items-center justify-between gap-3"
            key={member.id}
          >
            <Checkbox
              checked={member.isInvolved}
              onCheckedChange={(checked) => {
                void setMemberAmounts((prev) => [
                  ...prev.slice(0, ind),
                  {
                    ...(prev[ind] as {
                      isInvolved: boolean
                      name: string
                      amount: number
                      id: string
                    }),
                    isInvolved: !!checked,
                  },
                  ...prev.slice(ind + 1),
                ])
              }}
            />
            <Typography variant="p" className="!mt-0">
              {member.name}
            </Typography>
            <Input
              type="number"
              placeholder="amount"
              value={member.amount}
              disabled={!member.isInvolved}
              onChange={(e) => {
                void setMemberAmounts((prev) => [
                  ...prev.slice(0, ind),
                  {
                    ...(prev[ind] as {
                      isInvolved: boolean
                      name: string
                      amount: number
                      id: string
                    }),
                    amount: e.target.value,
                  },
                  ...prev.slice(ind + 1),
                ])
              }}
              className="max-w-[50%]"
            />
          </div>
        ))}
        {showError && (
          <Typography variant="p" className="!mt-0 text-destructive">
            please make sure amount of each member is valid
          </Typography>
        )}

        <DialogFooter className="flex flex-row gap-3">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" className="flex-1" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type Props = {
  recordDefaultValues?: FormSchema
  isEdit?: boolean
  members: Member[]
}

function RecordForm({ recordDefaultValues, isEdit = false, members }: Props) {
  const router = useRouter()
  const [paidByDialogOpen, setPaidByDialogOpen] = useState(false)
  const [forWhomDialogOpen, setForWhomByDialogOpen] = useState(false)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? recordDefaultValues
      : {
        what: '',
        amount: 0,
        paidBy: [],
        forWhom: [],
        note: '',
      },
  })

  const watchAmount = form.watch('amount')

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={(...args) => {
          void form.handleSubmit(onSubmit)(...args)
        }}
        className="relative space-y-8 pb-24"
      >
        <FormField
          control={form.control}
          name="what"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="Item Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="Amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="flex flex-col gap-1">
          <FormLabel>Paid by</FormLabel>
          <FormControl>
            <RecordFormPartiesDialog
              open={paidByDialogOpen}
              onOpenChange={setPaidByDialogOpen}
              amount={+watchAmount || 0}
              values={form.getValues('paidBy')}
              members={members}
              onSave={({ value }) => {
                void form.setValue('paidBy', value)
              }}
              dialogTitle="Paid By?"
            />
          </FormControl>
        </FormItem>
        <FormItem className="flex flex-col gap-1">
          <FormLabel>For Whom</FormLabel>
          <FormControl>
            <RecordFormPartiesDialog
              open={forWhomDialogOpen}
              onOpenChange={setForWhomByDialogOpen}
              amount={+watchAmount || 0}
              values={form.getValues('forWhom')}
              members={members}
              onSave={({ value }) => {
                void form.setValue('forWhom', value)
              }}
              dialogTitle="For Whom?"
            />
          </FormControl>
        </FormItem>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input placeholder="Note" {...field} />
              </FormControl>
              <FormDescription>This is where you take notes</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isEdit && (
          <Button type="button" variant="destructive">
            Delete
          </Button>
        )}
        <div className="fixed bottom-10 left-1/2 flex w-[calc(100vw-4rem)] -translate-x-1/2 gap-3 sm:w-1/4">
          {isEdit && (
            <Button
              type="button"
              className="flex-1"
              variant="secondary"
              onClick={() => {
                void router.back()
              }}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" className="flex-1">
            {isEdit ? 'Update' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RecordForm

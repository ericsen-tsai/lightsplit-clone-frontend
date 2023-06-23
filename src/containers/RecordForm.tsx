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
} from '@/components'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/router'

const formSchema = z.object({
  what: z.string().min(2, {
    message: 'Item name must be at least 2 characters.',
  }),
  amount: z.number().min(0, {
    message: 'Are you sure you did not lose money?',
  }),
  paidBy: z.array(
    z.object({
      member: z.string(),
      amount: z.number(),
    }),
  ),
  forWhom: z.array(
    z.object({
      member: z.string(),
      amount: z.number(),
    }),
  ),
  note: z.string(),
})

export type FormSchema = z.infer<typeof formSchema>

type Props = {
  recordDefaultValues?: FormSchema
  isEdit?: boolean
}

function RecordForm({ recordDefaultValues, isEdit = false }: Props) {
  const router = useRouter()
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
        className="relative space-y-8"
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

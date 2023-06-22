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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '@/components'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  groupName: z.string().min(2, {
    message: 'Group name must be at least 2 characters.',
  }),
  publicPermission: z.union([
    z.literal('limited'),
    z.literal('public'),
    z.literal('private'),
  ]),
  primaryCurrency: z.literal('TWD'),
  note: z.string(),
})

export type FormSchema = z.infer<typeof formSchema>

type Props = {
  groupDefaultValues?: FormSchema
  isEdit?: boolean
}

function GroupForm({ groupDefaultValues, isEdit = false }: Props) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? groupDefaultValues
      : {
        groupName: '',
        publicPermission: 'limited',
        primaryCurrency: 'TWD',
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
        className="space-y-8 relative"
      >
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Group Name" {...field} />
              </FormControl>
              <FormDescription>This is your group name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="publicPermission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Permission</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value as FormSchema['publicPermission'])}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a permission" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="limited">Limited</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="primaryCurrency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Permission</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value as FormSchema['primaryCurrency'])}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="TWD">TWD</SelectItem>
                </SelectContent>
              </Select>
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
        <div className="flex gap-3 fixed bottom-10 left-1/2 w-[calc(100vw-4rem)] -translate-x-1/2 sm:w-1/4">
          {isEdit && <Button type="button" className="flex-1" variant="destructive">Delete</Button>}
          <Button type="submit" className="flex-1">{isEdit ? 'Update' : 'Submit'}</Button>
        </div>
      </form>
    </Form>
  )
}

export default GroupForm

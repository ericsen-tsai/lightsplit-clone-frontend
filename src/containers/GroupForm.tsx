/* eslint-disable max-len */
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
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/router'
import { groupSchema } from '@/types'

const formSchema = groupSchema.omit({ id: true, owner: true }).merge(
  z.object({
    name: z.string().min(2, {
      message: 'Group name must be at least 2 characters.',
    }),
    note: z.string().optional(),
  }),
)

export type FormSchema = z.infer<typeof formSchema>

type Props = {
  groupDefaultValues?: FormSchema
  isEdit?: boolean
  handleCreate?: (data: FormSchema) => void | Promise<void>
  handleUpdate?: (data: FormSchema) => void | Promise<void>
  handleDelete?: () => void
}

function GroupForm({
  groupDefaultValues,
  isEdit = false,
  handleCreate = console.log,
  handleDelete = console.log,
  handleUpdate = console.log,
}: Props) {
  const submitFunc = isEdit ? handleUpdate : handleCreate
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? groupDefaultValues
      : {
        name: '',
        publicPermission: 'limited',
        primaryCurrency: 'TWD',
        note: '',
      },
  })
  const router = useRouter()

  function onSubmit(values: FormSchema) {
    void submitFunc(values)
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
          name="name"
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
              <FormLabel>Primary Currency</FormLabel>
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
        {isEdit && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">
                Delete Group
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this group and remove related data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button type="button" variant="destructive" onClick={handleDelete}>
                    Continue
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

export default GroupForm

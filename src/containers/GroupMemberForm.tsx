import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
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
  Input,
} from '@/components'
import { useRouter } from 'next/router'

const formSchema = z.object({
  member: z.array(
    z.object({
      name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
      }),
      permission: z.union([z.literal('view'), z.literal('edit')]),
    }),
  ),
})

export type FormSchema = z.infer<typeof formSchema>

type Props = {
  isEdit?: boolean
  memberDefaultValues?: FormSchema['member']
}

function GroupMemberForm({ isEdit = false, memberDefaultValues = [] }: Props) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member: isEdit ? memberDefaultValues : [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'member' as never,
  })

  const router = useRouter()

  // 2. Define a submit handler.
  function onSubmit(values: FormSchema) {
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
        <li className="mt-10 flex items-end gap-3">
          <FormItem className="flex-1">
            <FormLabel>Name</FormLabel>
            <Input placeholder="You" disabled />
          </FormItem>
          <FormItem>
            <FormLabel>Permission</FormLabel>
            <Select defaultValue="edit" disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select a permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="edit">Can Edit</SelectItem>
                <SelectItem value="view">Can View</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
          <Button variant="destructive" type="button" disabled>
            Delete
          </Button>
        </li>
        <ul>
          {fields.map((item, index) => (
            <li key={item.id} className="mb-5 flex items-end gap-3">
              <FormField
                control={form.control}
                name={`member.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`member.${index}.permission`}
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value) => field.onChange(
                          value as FormSchema['member'][number]['permission'],
                      )}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a permission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="edit">Can Edit</SelectItem>
                        <SelectItem value="view">Can View</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="destructive"
                type="button"
                onClick={() => remove(index)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>

        <Button
          type="button"
          className="w-full"
          variant="default"
          onClick={() => append({ name: `Member ${fields.length + 1}`, permission: 'edit' })}
        >
          Add Member
        </Button>
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
            {isEdit ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default GroupMemberForm

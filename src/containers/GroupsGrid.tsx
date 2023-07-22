import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Typography,
} from '@/components'
import { type Group } from '@/types'
import { useRouter } from 'next/router'

function GroupCard(props: Group) {
  const {
    name, note, publicPermission, id,
  } = props
  const router = useRouter()
  return (
    <Card className="w-full min-w-[200px]">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{note}</CardDescription>
      </CardHeader>
      <CardContent>
        <Typography className="font-bold uppercase">
          {publicPermission}
        </Typography>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={() => {
            void router.push(`/group/${id}`)
          }}
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  )
}

function GroupsGrid({ groups }: { groups: Group[] }) {
  const router = useRouter()
  return (
    <div className="relative grid w-full grid-cols-1 gap-3 pb-24 sm:grid-cols-3 sm:pb-0">
      {groups.map((group) => (
        <GroupCard {...group} key={group.id} />
      ))}
      {groups.length === 0 && (
        <div className="text-center">
          <Typography variant="h4">
            You don&apos;t have any group yet, create one!
          </Typography>
        </div>
      )}
      <Button
        variant="default"
        className="fixed bottom-10 left-1/2 w-[calc(100vw-4rem)] -translate-x-1/2 sm:w-1/4"
        onClick={() => {
          void router.push('/group/new')
        }}
      >
        Create Group
      </Button>
    </div>
  )
}

export default GroupsGrid

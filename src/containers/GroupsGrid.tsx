import { fakeGroups } from '@/utils/fakeData'

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
  const { name, note, publicPermission } = props
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
        <Button>Details</Button>
      </CardFooter>
    </Card>
  )
}

function GroupsGrid() {
  const router = useRouter()
  return (
    <div className="relative grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
      {fakeGroups.map((group) => (
        <GroupCard {...group} key={group.id} />
      ))}
      <Button
        variant="default"
        className="fixed bottom-10 left-1/2 w-[calc(100vw-4rem)] -translate-x-1/2 sm:w-1/4"
        onClick={() => { void router.push('/group/new') }}
      >
        Add Group
      </Button>
    </div>
  )
}

export default GroupsGrid

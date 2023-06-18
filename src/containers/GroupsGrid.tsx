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

function GroupCard(props: Group) {
  const { name, note, publicPermission } = props
  return (
    <Card className="min-w-[200px] w-full">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{note}</CardDescription>
      </CardHeader>
      <CardContent>
        <Typography className="uppercase font-bold">
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full relative">
      {fakeGroups.map((group) => <GroupCard {...group} key={group.id} />)}
      <Button variant="default" className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100vw-4rem)] sm:w-1/4">ADD GROUP</Button>
    </div>
  )
}

export default GroupsGrid

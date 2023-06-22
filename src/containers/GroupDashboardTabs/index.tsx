import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components'

import { fakeMembers } from '@/utils/fakeData'
import BalanceRow from './BalanceRow'

function TabsDemo() {
  return (
    <Tabs defaultValue="records" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="records">Records</TabsTrigger>
        <TabsTrigger value="balances">Balances</TabsTrigger>
      </TabsList>
      <TabsContent value="records">
        <Card>
          <CardHeader>
            <CardTitle>Records</CardTitle>
            <CardDescription>
              The list shows detailed expense records.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="balances">
        <Card>
          <CardHeader>
            <CardTitle>Balances</CardTitle>
            <CardDescription>
              The list shows how much each person owes and takes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {fakeMembers.map((member) => (
              <BalanceRow
                username={member.name}
                balance={member.primaryBalance}
                maxBalance={Math.max(
                  ...fakeMembers.map((m) => Math.abs(m.primaryBalance)),
                )}
                key={member.name}
              />
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default TabsDemo

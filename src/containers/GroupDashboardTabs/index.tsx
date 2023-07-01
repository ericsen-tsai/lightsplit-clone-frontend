import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components'

import { type Member, type BalanceRecord } from '@/types'
import BalanceRow from './BalanceRow'
import RecordRows from './RecordRows'

type Props = {
  members: Member[]
  records: BalanceRecord[]
  yourMemberId: string
}

function GroupDashboardTabs({ members, records, yourMemberId }: Props) {
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
            <RecordRows members={members} records={records} yourMemberId={yourMemberId} />
          </CardContent>
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
            {members.map((member) => (
              <BalanceRow
                username={member.name}
                balance={member.primaryBalance}
                maxBalance={Math.max(
                  ...members.map((m) => Math.abs(m.primaryBalance)),
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

export default GroupDashboardTabs

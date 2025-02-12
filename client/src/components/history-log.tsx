
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"

export function HistoryLog() {
  const { data: history, isError, isLoading } = useQuery({
    queryKey: ['inventory-history'],
    queryFn: async () => {
      const response = await fetch('/api/inventory/history')
      return response.json()
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>History Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Total Items</TableHead>
              <TableHead>New Items</TableHead>
              <TableHead>Used Items</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>New Value</TableHead>
              <TableHead>Used Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history?.map((entry) => (
              <TableRow key={entry.date}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.totalItems}</TableCell>
                <TableCell>{entry.newItems}</TableCell>
                <TableCell>{entry.usedItems}</TableCell>
                <TableCell>${entry.totalValue.toFixed(2)}</TableCell>
                <TableCell>${entry.newValue.toFixed(2)}</TableCell>
                <TableCell>${entry.usedValue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

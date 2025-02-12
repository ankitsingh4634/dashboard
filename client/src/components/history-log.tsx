
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>History Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1,2,3].map((i) => (
              <div key={i} className="h-8 bg-gray-100 animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return <div>Error loading history</div>;
  }

  if (!history || history.length === 0) {
    return <div>No history available</div>;
  }

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
            {history?.map((entry, index) => (
              <TableRow key={`${entry.date}-${index}`}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.totalItems}</TableCell>
                <TableCell>{entry.newItems}</TableCell>
                <TableCell>{entry.usedItems}</TableCell>
                <TableCell>${entry.totalValue?.toFixed(2) ?? '0.00'}</TableCell>
                <TableCell>${entry.newValue?.toFixed(2) ?? '0.00'}</TableCell>
                <TableCell>${entry.usedValue?.toFixed(2) ?? '0.00'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

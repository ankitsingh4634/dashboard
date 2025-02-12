import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"

export function InventoryStats() {
  const { data: stats, isError, isLoading } = useQuery({
    queryKey: ['inventory-stats'],
    queryFn: async () => {
      const response = await fetch('/api/inventory/stats')
      return response.json()
    }
  })

  const metrics = [
    { label: 'Total Items', value: stats?.totalItems || 0 },
    { label: 'Total Value (USD)', value: stats?.totalValue?.toFixed(2) || '0.00' },
    { label: 'New Avg. MSRP', value: stats?.newAvgMsrp?.toFixed(2) || '0.00' },
    { label: 'Used Items', value: stats?.usedItems || 0 },
    { label: 'Used Value (USD)', value: stats?.usedValue?.toFixed(2) || '0.00' },
    { label: 'Used Avg. MSRP', value: stats?.usedAvgMsrp?.toFixed(2) || '0.00' },
    { label: 'Categories', value: stats?.categories || 0 },
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[1,2,3,4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Error loading stats</div>;
  }

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardContent className="p-4">
            <div className="text-sm font-medium">{metric.label}</div>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
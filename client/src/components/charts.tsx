import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export function InventoryCharts() {
  const { data: chartData, isError, isLoading } = useQuery({
    queryKey: ['inventory-charts'],
    queryFn: async () => {
      const response = await fetch('/api/inventory/charts')
      return response.json()
    }
  })

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[1,2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div>Error loading charts</div>;
  }

  if (!chartData?.inventoryCount?.length || !chartData?.averageMsrp?.length) {
    return <div className="text-center py-4">No chart data available</div>;
  }

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData?.inventoryCount}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average MSRP in USD</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData?.averageMsrp}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'MSRP']} />
                <Line type="monotone" dataKey="msrp" stroke="#f97316" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import type { Vehicle } from "@shared/schema";

interface ChartProps {
  vehicles: Vehicle[];
}

export function Charts({ vehicles }: ChartProps) {
  const chartData = useMemo(() => {
    const byMonth: Record<string, { count: number; avgPrice: number }> = {};
    
    vehicles.forEach(vehicle => {
      const month = new Date(vehicle.timestamp).toLocaleString('default', { month: 'short' });
      
      if (!byMonth[month]) {
        byMonth[month] = { count: 0, avgPrice: 0 };
      }
      
      byMonth[month].count++;
      byMonth[month].avgPrice = (byMonth[month].avgPrice * (byMonth[month].count - 1) + vehicle.price) / byMonth[month].count;
    });

    return Object.entries(byMonth).map(([month, data]) => ({
      month,
      count: data.count,
      avgPrice: Math.round(data.avgPrice)
    }));
  }, [vehicles]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

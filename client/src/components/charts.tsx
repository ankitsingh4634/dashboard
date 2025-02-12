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
    const byMonth: Record<string, { count: number }> = {};

    vehicles.forEach(vehicle => {
      const date = new Date(vehicle.timestamp);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!byMonth[key]) {
        byMonth[key] = { count: 0 };
      }

      byMonth[key].count++;
    });

    return Object.entries(byMonth)
      .map(([month, data]) => ({
        month,
        count: data.count,
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        return new Date(`${aMonth} 1, ${aYear}`).getTime() - new Date(`${bMonth} 1, ${bYear}`).getTime();
      });
  }, [vehicles]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Monthly Inventory Trends</h2>

      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="rgb(99, 102, 241)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
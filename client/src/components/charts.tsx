
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
  const inventoryData = useMemo(() => {
    const byMonth: Record<string, { count: number; avgMSRP: number }> = {};

    vehicles.forEach(vehicle => {
      const date = new Date(vehicle.timestamp);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!byMonth[key]) {
        byMonth[key] = { count: 0, avgMSRP: 0 };
      }

      byMonth[key].count++;
      byMonth[key].avgMSRP += vehicle.price;
    });

    // Calculate averages
    Object.keys(byMonth).forEach(key => {
      byMonth[key].avgMSRP = byMonth[key].avgMSRP / byMonth[key].count;
    });

    return Object.entries(byMonth)
      .map(([month, data]) => ({
        month,
        count: data.count,
        avgMSRP: Math.round(data.avgMSRP)
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        return new Date(`${aMonth} 1, ${aYear}`).getTime() - new Date(`${bMonth} 1, ${bYear}`).getTime();
      });
  }, [vehicles]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Inventory Count</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ff9f43" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Average MSRP in USD</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgMSRP" fill="#54a0ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

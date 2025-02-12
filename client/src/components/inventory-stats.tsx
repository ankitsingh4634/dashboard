import { useMemo } from "react";
import type { Vehicle } from "@shared/schema";

interface StatsProps {
  vehicles: Vehicle[];
}

export function InventoryStats({ vehicles }: StatsProps) {
  const stats = useMemo(() => {
    const totalMSRP = vehicles.reduce((sum, v) => sum + v.price, 0);
    const avgMSRP = vehicles.length ? totalMSRP / vehicles.length : 0;
    const totalLeadTime = vehicles.reduce((sum, v) => sum + (v.leadTime || 0), 0);
    const avgLeadTime = vehicles.length ? totalLeadTime / vehicles.length : 0;

    return {
      totalVehicles: vehicles.length,
      totalMSRP: totalMSRP,
      avgMSRP: avgMSRP,
      totalLeadTime: totalLeadTime,
      avgLeadTime: avgLeadTime
    };
  }, [vehicles]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatsCard
          label="Total Vehicles"
          value={stats.totalVehicles}
          subValue={null}
        />
        <StatsCard
          label="Total MSRP"
          value={`$${stats.totalMSRP.toLocaleString()}`}
          subValue="USD MSRP"
        />
        <StatsCard
          label="Avg MSRP"
          value={`$${stats.avgMSRP.toLocaleString()}`}
          subValue="Avg USD MSRP"
        />
        <StatsCard
          label="Avg Lead Time"
          value={stats.avgLeadTime.toFixed(1)}
          subValue="Days"
        />
      </div>
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value: string | number;
  subValue: string | null;
}

function StatsCard({ label, value, subValue }: StatsCardProps) {
  return (
    <div className="p-4 rounded-lg bg-white border">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {subValue && <div className="mt-1 text-sm text-gray-600">{subValue}</div>}
    </div>
  );
}
import { useMemo } from "react";
import type { Vehicle } from "@shared/schema";

interface StatsProps {
  vehicles: Vehicle[];
}

export function InventoryStats({ vehicles }: StatsProps) {
  const stats = useMemo(() => {
    const byCondition = {
      new: vehicles.filter(v => v.condition === "new"),
      used: vehicles.filter(v => v.condition === "used"),
      cpo: vehicles.filter(v => v.condition === "cpo")
    };

    const getAvgMSRP = (vehicles: Vehicle[]) => {
      if (vehicles.length === 0) return 0;
      return vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length;
    };

    return {
      counts: {
        new: byCondition.new.length,
        used: byCondition.used.length,
        cpo: byCondition.cpo.length
      },
      avgMSRP: {
        new: getAvgMSRP(byCondition.new),
        used: getAvgMSRP(byCondition.used),
        cpo: getAvgMSRP(byCondition.cpo)
      }
    };
  }, [vehicles]);

  const total = vehicles.length;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Inventory Count</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <StatsCard
            label="NEW"
            count={stats.counts.new}
            price={stats.avgMSRP.new}
            percentage={(stats.counts.new / total) * 100}
          />
          <StatsCard
            label="USED"
            count={stats.counts.used}
            price={stats.avgMSRP.used}
            percentage={(stats.counts.used / total) * 100}
          />
          <StatsCard
            label="CPO"
            count={stats.counts.cpo}
            price={stats.avgMSRP.cpo}
            percentage={(stats.counts.cpo / total) * 100}
          />
        </div>
      </div>
    </div>
  );
}

interface StatsCardProps {
  label: string;
  count: number;
  price: number;
  percentage: number;
}

function StatsCard({ label, count, price, percentage }: StatsCardProps) {
  return (
    <div className="p-4 rounded-lg bg-gray-50">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="mt-2 flex justify-between items-baseline">
        <div className="text-2xl font-semibold">{count}</div>
        <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
      </div>
      <div className="mt-1 text-sm text-gray-600">
        ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
}
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Inventory Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">Inventory Count</h3>
          <div className="space-y-2">
            <div>NEW: {stats.counts.new}</div>
            <div>USED: {stats.counts.used}</div>
            <div>CPO: {stats.counts.cpo}</div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Average MSRP</h3>
          <div className="space-y-2">
            <div>NEW: ${stats.avgMSRP.new.toFixed(2)}</div>
            <div>USED: ${stats.avgMSRP.used.toFixed(2)}</div>
            <div>CPO: ${stats.avgMSRP.cpo.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

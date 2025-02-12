import { useMemo } from "react";
import type { Vehicle } from "@shared/schema";

interface StatsProps {
  vehicles: Vehicle[];
}

export function InventoryStats({ vehicles }: StatsProps) {
  const stats = useMemo(() => {
    const categories = {
      new: { count: 0, totalMSRP: 0 },
      used: { count: 0, totalMSRP: 0 },
      cpo: { count: 0, totalMSRP: 0 }
    };

    vehicles.forEach((v) => {
      const price = parseFloat(v.price.toString().replace(/[^0-9.]/g, "")); // Removes " USD" and converts to number
      const msrp = isNaN(price) ? 0 : price;

      if (v.condition === "new") {
        categories.new.count++;
        categories.new.totalMSRP += msrp;
      } else if (v.condition === "used") {
        categories.used.count++;
        categories.used.totalMSRP += msrp;
      } else if (v.condition === "cpo") {
        categories.cpo.count++;
        categories.cpo.totalMSRP += msrp;
      }
    });

    return {
      new: {
        count: categories.new.count,
        totalMSRP: Math.round(categories.new.totalMSRP),
        avgMSRP: categories.new.count
          ? Math.round(categories.new.totalMSRP / categories.new.count)
          : 0
      },
      used: {
        count: categories.used.count,
        totalMSRP: Math.round(categories.used.totalMSRP),
        avgMSRP: categories.used.count
          ? Math.round(categories.used.totalMSRP / categories.used.count)
          : 0
      },
      cpo: {
        count: categories.cpo.count,
        totalMSRP: Math.round(categories.cpo.totalMSRP),
        avgMSRP: categories.cpo.count
          ? Math.round(categories.cpo.totalMSRP / categories.cpo.count)
          : 0
      }
    };
  }, [vehicles]);

  return (
    <div className="space-y-6">
   <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-8 gap-4 overflow-x-auto">


        {/* New Vehicles */}
        <StatsCard label="New Units" value={stats.new.count} subValue="Units" />
        <StatsCard
          label="New MSRP"
          value={`$${stats.new.totalMSRP.toLocaleString()}`}
          subValue="USD MSRP"
        />
        <StatsCard
          label="New Avg MSRP"
          value={`$${stats.new.avgMSRP.toLocaleString()}`}
          subValue="Avg USD MSRP"
        />

        {/* Used Vehicles */}
        <StatsCard
          label="Used Units"
          value={stats.used.count}
          subValue="Units"
        />
        <StatsCard
          label="Used MSRP"
          value={`$${stats.used.totalMSRP.toLocaleString()}`}
          subValue="USD MSRP"
        />
        <StatsCard
          label="Used Avg MSRP"
          value={`$${stats.used.avgMSRP.toLocaleString()}`}
          subValue="Avg USD MSRP"
        />

        {/* Certified Pre-Owned (CPO) Vehicles */}
        <StatsCard label="CPO Units" value={stats.cpo.count} subValue="Units" />
        <StatsCard
          label="CPO MSRP"
          value={`$${stats.cpo.totalMSRP.toLocaleString()}`}
          subValue="USD MSRP"
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

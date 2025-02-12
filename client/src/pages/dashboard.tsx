import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { InventoryStats } from "@/components/inventory-stats";
import { Filters } from "@/components/filters";
import { HistoryLog } from "@/components/history-log";
import { InventoryCharts } from "@/components/charts";
import type { Vehicle } from "@shared/schema";

export default function Dashboard() {
  const filters = useSelector((state: RootState) => state.filters);

  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['/api/inventory', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.dateFilter) params.append('dateFilter', filters.dateFilter);

      const response = await fetch(`/api/inventory?${params}`);
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No inventory data available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
      <InventoryStats />
      <InventoryCharts />
      <HistoryLog />
    </div>
  );
}
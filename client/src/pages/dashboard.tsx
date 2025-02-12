import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { InventoryStats } from "@/components/inventory-stats";
import { Filters } from "@/components/filters";
import { HistoryLog } from "@/components/history-log";
import { Charts } from "@/components/charts";
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">Vehicle Inventory Dashboard</h1>

        {/* Inventory Stats */}
        <div className="mb-6">
          <InventoryStats vehicles={vehicles || []} />
        </div>

        {/* Filters Below Inventory Stats */}
        <div className="mb-6">
          <Filters />
        </div>

        {/* Charts Below Filters */}
        <div className="mb-6">
          <Charts vehicles={vehicles || []} />
        </div>

        {/* Scrollable History Log Table */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="overflow-auto max-h-[400px]"> 
            {/* Adjust max-h-[400px] as needed */}
            <HistoryLog vehicles={vehicles || []} />
          </div>
        </Card>
      </div>
    </div>
  );
}

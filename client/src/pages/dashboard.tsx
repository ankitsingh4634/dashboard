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
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Vehicle Inventory Dashboard</h1>
        <Filters />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <InventoryStats vehicles={vehicles || []} />
        </Card>
        <Card className="p-6">
          <Charts vehicles={vehicles || []} />
        </Card>
      </div>

      <Card className="p-6">
        <HistoryLog vehicles={vehicles || []} />
      </Card>
    </div>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { setCondition, setBrand, setDateFilter, resetFilters } from "@/lib/store";
import type { RootState } from "@/lib/store";
import { vehicleConditions, dateFilters, type VehicleCondition, type DateFilter } from "@shared/schema";

export function Filters() {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <Select
        value={filters.condition || ""}
        onValueChange={(value) => dispatch(setCondition(value as VehicleCondition || null))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select condition" />
        </SelectTrigger>
        <SelectContent>
          {vehicleConditions.map((condition) => (
            <SelectItem key={condition} value={condition}>
              {condition.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.dateFilter || ""}
        onValueChange={(value) => dispatch(setDateFilter(value as DateFilter || null))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time period" />
        </SelectTrigger>
        <SelectContent>
          {dateFilters.map((filter) => (
            <SelectItem key={filter} value={filter}>
              {filter.replace(/_/g, " ").toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => dispatch(resetFilters())}
      >
        Reset Filters
      </Button>
    </div>
  );
}
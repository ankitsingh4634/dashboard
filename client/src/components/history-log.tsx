import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Vehicle } from "@shared/schema";
import { format } from "date-fns";

interface LogProps {
  vehicles: Vehicle[];
}

export function HistoryLog({ vehicles }: LogProps) {
  // Sort vehicles by timestamp in descending order
  const sortedVehicles = [...vehicles].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">History Log</h2>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[180px]">Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedVehicles.slice(0, 10).map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">
                  {format(new Date(vehicle.timestamp), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>{vehicle.title}</TableCell>
                <TableCell>{vehicle.condition.toUpperCase()}</TableCell>
                <TableCell>{vehicle.brand}</TableCell>
                <TableCell className="text-right">
                  ${vehicle.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
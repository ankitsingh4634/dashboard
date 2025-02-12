
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
              <TableHead>Date</TableHead>
              <TableHead>Vehicle Info</TableHead>
              <TableHead>Lead Time</TableHead>
              <TableHead>Total MSRP</TableHead>
              <TableHead>Last Status</TableHead>
              <TableHead>Last Total MSRP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{format(new Date(vehicle.timestamp), "MMM dd, yy")}</TableCell>
                <TableCell>{vehicle.title}</TableCell>
                <TableCell>{vehicle.leadTime || '-'}</TableCell>
                <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                <TableCell>{vehicle.condition.toUpperCase()}</TableCell>
                <TableCell>${vehicle.price.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

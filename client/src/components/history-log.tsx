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
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">History Log</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>
                {format(new Date(vehicle.timestamp), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{vehicle.title}</TableCell>
              <TableCell>{vehicle.condition.toUpperCase()}</TableCell>
              <TableCell>{vehicle.brand}</TableCell>
              <TableCell>${vehicle.price.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

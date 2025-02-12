import { vehicles, type Vehicle, type InsertVehicle } from "@shared/schema";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface IStorage {
  getVehicles(): Promise<Vehicle[]>;
  getVehiclesByCondition(condition: string): Promise<Vehicle[]>;
  getVehiclesByBrand(brand: string): Promise<Vehicle[]>;
  getVehiclesByDateRange(startDate: Date, endDate: Date): Promise<Vehicle[]>;
}

export class MemStorage implements IStorage {
  private vehicles: Vehicle[];

  constructor() {
    const csvPath = join(__dirname, "..", "attached_assets", "sample-data-v2.csv");
    const csvContent = readFileSync(csvPath, "utf-8");
    
    const rawRecords = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    this.vehicles = rawRecords.map((record: any) => ({
      ...record,
      price: parseFloat(record.price),
      timestamp: new Date(record.timestamp)
    }));
  }

  async getVehicles(): Promise<Vehicle[]> {
    return this.vehicles;
  }

  async getVehiclesByCondition(condition: string): Promise<Vehicle[]> {
    return this.vehicles.filter(v => v.condition.toLowerCase() === condition.toLowerCase());
  }

  async getVehiclesByBrand(brand: string): Promise<Vehicle[]> {
    return this.vehicles.filter(v => v.brand.toLowerCase() === brand.toLowerCase());
  }

  async getVehiclesByDateRange(startDate: Date, endDate: Date): Promise<Vehicle[]> {
    return this.vehicles.filter(v => {
      const timestamp = new Date(v.timestamp);
      return timestamp >= startDate && timestamp <= endDate;
    });
  }
}

export const storage = new MemStorage();

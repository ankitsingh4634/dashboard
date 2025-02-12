import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Fix: Define `__dirname` for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the path to the CSV file
const csvFilePath = join(__dirname, "..", "attached_assets", "sample-data-v2.csv");

// Function to import and parse CSV data
function importData() {
  try {
    const csvContent = readFileSync(csvFilePath, "utf-8");
    return parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });
  } catch (error) {
    console.error("Error reading CSV:", error);
    return [];
  }
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  condition: string;
  timestamp: string;
}

export interface IStorage {
  getVehicles(): Promise<Vehicle[]>;
  getVehiclesByCondition(condition: string): Promise<Vehicle[]>;
  getVehiclesByBrand(brand: string): Promise<Vehicle[]>;
  getVehiclesByDateRange(startDate: Date, endDate: Date): Promise<Vehicle[]>;
}

class CsvStorage implements IStorage {
  private vehicles: Vehicle[] = importData(); // Load CSV data once at startup

  async getVehicles(): Promise<Vehicle[]> {
    return this.vehicles;
  }

  async getVehiclesByCondition(condition: string): Promise<Vehicle[]> {
    return this.vehicles.filter(vehicle => vehicle.condition.toLowerCase() === condition.toLowerCase());
  }

  async getVehiclesByBrand(brand: string): Promise<Vehicle[]> {
    return this.vehicles.filter(vehicle => vehicle.brand.toLowerCase() === brand.toLowerCase());
  }

  async getVehiclesByDateRange(startDate: Date, endDate: Date): Promise<Vehicle[]> {
    return this.vehicles.filter(vehicle => {
      const vehicleDate = new Date(vehicle.timestamp);
      return vehicleDate >= startDate && vehicleDate <= endDate;
    });
  }
}

export const storage = new CsvStorage();

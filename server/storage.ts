import { vehicles, type Vehicle, type InsertVehicle } from "@shared/schema";
import { db } from "./db";
import { and, gte, lte, eq } from "drizzle-orm";

export interface IStorage {
  getVehicles(): Promise<Vehicle[]>;
  getVehiclesByCondition(condition: string): Promise<Vehicle[]>;
  getVehiclesByBrand(brand: string): Promise<Vehicle[]>;
  getVehiclesByDateRange(startDate: Date, endDate: Date): Promise<Vehicle[]>;
}

export class DatabaseStorage implements IStorage {
  async getVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles);
  }

  async getVehiclesByCondition(condition: string): Promise<Vehicle[]> {
    return await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.condition, condition.toLowerCase()));
  }

  async getVehiclesByBrand(brand: string): Promise<Vehicle[]> {
    return await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.brand, brand));
  }

  async getVehiclesByDateRange(startDate: Date, endDate: Date): Promise<Vehicle[]> {
    return await db
      .select()
      .from(vehicles)
      .where(
        and(
          gte(vehicles.timestamp, startDate),
          lte(vehicles.timestamp, endDate)
        )
      );
  }
}

export const storage = new DatabaseStorage();
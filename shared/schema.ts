import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  condition: text("condition").notNull(), // new, used, cpo
  description: text("description").notNull(),
  title: text("title").notNull(),
  brand: text("brand").notNull(),
  price: real("price").notNull(),
  product_type: text("product_type").notNull(),
  custom_label_0: text("custom_label_0"),
  leadTime: integer("leadTime"), // Add this line
  timestamp: timestamp("timestamp").notNull()
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({ 
  id: true 
});

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export const vehicleConditions = ["new", "used", "cpo"] as const;
export type VehicleCondition = typeof vehicleConditions[number];

export const dateFilters = [
  "last_month",
  "this_month", 
  "last_3_months",
  "last_6_months",
  "this_year",
  "last_year"
] as const;

export type DateFilter = typeof dateFilters[number];

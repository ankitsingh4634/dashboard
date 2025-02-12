import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

export function registerRoutes(app: Express): Server {
  app.get("/api/inventory", async (req, res) => {
    const { condition, brand, dateFilter } = req.query;
    let vehicles = await storage.getVehicles();

    if (condition) {
      vehicles = await storage.getVehiclesByCondition(condition as string);
    }

    if (brand) {
      vehicles = await storage.getVehiclesByBrand(brand as string);
    }

    if (dateFilter) {
      const now = new Date();
      let startDate: Date, endDate: Date;

      switch (dateFilter) {
        case "last_month":
          startDate = startOfMonth(subMonths(now, 1));
          endDate = endOfMonth(subMonths(now, 1));
          break;
        case "this_month":
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case "last_3_months":
          startDate = startOfMonth(subMonths(now, 3));
          endDate = now;
          break;
        case "last_6_months":
          startDate = startOfMonth(subMonths(now, 6));
          endDate = now;
          break;
        case "this_year":
          startDate = startOfYear(now);
          endDate = endOfYear(now);
          break;
        case "last_year":
          startDate = startOfYear(subMonths(now, 12));
          endDate = endOfYear(subMonths(now, 12));
          break;
        default:
          startDate = new Date(0);
          endDate = now;
      }

      vehicles = await storage.getVehiclesByDateRange(startDate, endDate);
    }

    res.json(vehicles);
  });

  const httpServer = createServer(app);
  return httpServer;
}

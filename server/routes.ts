import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { db } from "./db";
import type { Vehicle } from "@shared/schema";

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

export async function getStats() {
  const vehicles = await db.all<Vehicle[]>("SELECT * FROM vehicles");

  return {
    totalItems: vehicles.length,
    totalValue: vehicles.reduce((sum, v) => sum + v.msrp, 0),
    newItems: vehicles.filter(v => v.condition === 'new').length,
    usedItems: vehicles.filter(v => v.condition === 'used').length,
    newAvgMsrp: vehicles.filter(v => v.condition === 'new').reduce((sum, v) => sum + v.msrp, 0) / vehicles.filter(v => v.condition === 'new').length,
    usedAvgMsrp: vehicles.filter(v => v.condition === 'used').reduce((sum, v) => sum + v.msrp, 0) / vehicles.filter(v => v.condition === 'used').length,
    categories: new Set(vehicles.map(v => v.category)).size
  };
}

export async function getCharts() {
  const vehicles = await db.all<Vehicle[]>("SELECT * FROM vehicles ORDER BY created_at DESC");
  
  const countMap = new Map();
  const msrpMap = new Map();
  
  vehicles.forEach(v => {
    const date = new Date(v.created_at).toLocaleDateString();
    countMap.set(date, (countMap.get(date) || 0) + 1);
    
    const current = msrpMap.get(date) || { total: 0, count: 0 };
    msrpMap.set(date, {
      total: current.total + v.msrp,
      count: current.count + 1
    });
  });

  const inventoryCount = Array.from(countMap.entries())
    .map(([date, count]) => ({ date, count }))
    .slice(0, 12);

  const averageMsrp = Array.from(msrpMap.entries())
    .map(([date, { total, count }]) => ({
      date,
      msrp: total / count
    }))
    .slice(0, 12);

  return { inventoryCount, averageMsrp };
}

export async function getHistory() {
  const vehicles = await db.all<Vehicle[]>("SELECT * FROM vehicles ORDER BY created_at DESC");
  
  const historyMap = new Map();
  
  vehicles.forEach(v => {
    const date = new Date(v.created_at).toLocaleDateString();
    const current = historyMap.get(date) || {
      date,
      totalItems: 0,
      newItems: 0,
      usedItems: 0,
      totalValue: 0,
      newValue: 0,
      usedValue: 0
    };
    
    current.totalItems += 1;
    current.totalValue += v.msrp;
    if (v.condition === 'new') {
      current.newItems += 1;
      current.newValue += v.msrp;
    } else {
      current.usedItems += 1;
      current.usedValue += v.msrp;
    }
    
    historyMap.set(date, current);
  });

  return Array.from(historyMap.values()).slice(0, 7);
}
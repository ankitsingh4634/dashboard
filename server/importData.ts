import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { db } from "./db";
import { vehicles } from "@shared/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function importData() {
  try {
    const csvPath = join(__dirname, "..", "attached_assets", "sample-data-v2.csv");
    const csvContent = readFileSync(csvPath, "utf-8");
    
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Process each record and prepare for insertion
    const data = records.map((record: any) => ({
      condition: record.condition.toLowerCase(),
      description: record.description,
      title: record.title,
      brand: record.brand,
      price: parseFloat(record.price.replace(" USD", "")),
      product_type: record.product_type,
      custom_label_0: record.custom_label_0,
      timestamp: new Date(record.timestamp)
    }));

    // Clear existing data
    await db.delete(vehicles);

    // Insert all records
    await db.insert(vehicles).values(data);
    
    console.log("Data import completed successfully");
  } catch (error) {
    console.error("Error importing data:", error);
    throw error;
  }
}

// Run the import
importData();

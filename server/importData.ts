import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function importData() {
  try {
    const csvPath = join(__dirname, "..", "attached_assets", "sample-data-v2.csv");
    const csvContent = readFileSync(csvPath, "utf-8");

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    return records; // Return parsed data
  } catch (error) {
    console.error("Error reading CSV:", error);
    return [];
  }
}

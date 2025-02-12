import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

export let db: any = null;
export let pool: any = null;

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ Warning: No DATABASE_URL set. Skipping database connection.");
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}
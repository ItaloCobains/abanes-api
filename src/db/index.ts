import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "test"
      ? process.env.DATABASE_URL_TEST!
      : process.env.DATABASE_URL!,
});

export const db = drizzle({ client: pool });

export * from "./schema";

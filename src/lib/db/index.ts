// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";

// if (!process.env.NEON_DB) {
//   throw new Error("database url not found");
// }

// const sql = postgres(process.env.NEON_DB, { ssl: "require" });

// export const db = drizzle(sql);
// "postgres": "^3.4.2",

import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

if (!process.env.NEON_DB) {
  throw new Error("database url not found");
}

const sql = neon(process.env.NEON_DB);

export const db = drizzle(sql);

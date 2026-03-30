import "server-only";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

// oxlint-disable-next-line typescript/no-non-null-assertion
export const db = drizzle(process.env.DATABASE_URL!, { schema });

export type Database = typeof db;

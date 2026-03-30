import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    // oxlint-disable-next-line typescript/no-non-null-assertion
    url: process.env.DATABASE_URL!,
  },
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./shared/lib/db/schema.ts",
});

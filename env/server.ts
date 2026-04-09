import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  experimental__runtimeEnv: process.env,

  server: {
    ADMIN_EMAILS: z.string(),

    BETTER_AUTH_SECRET: z.string(),

    BETTER_AUTH_URL: z.url(),

    DATABASE_URL: z.url(),
    GITHUB_CLIENT_ID: z.string(),

    GITHUB_CLIENT_SECRET: z.string(),
  },
});

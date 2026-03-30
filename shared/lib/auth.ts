// oxlint-disable typescript/no-non-null-assertion
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      account: schema.account,
      session: schema.session,
      user: schema.users,
      verification: schema.verifications,
    },
  }),
  // OAuth-only: email/password disabled
  // Set enabled: true to re-enable in the future
  emailAndPassword: {
    enabled: false,
    maxPasswordLength: 128,
    minPasswordLength: 8,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
    expiresIn: 60 * 60 * 24 * 7,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
  user: {
    additionalFields: {
      bio: {
        type: "string",
      },
      company: {
        type: "string",
      },
      organizerRole: {
        type: "string",
      },
      role: {
        defaultValue: "user",
        type: "string",
      },
      userType: {
        defaultValue: "participant",
        type: "string",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

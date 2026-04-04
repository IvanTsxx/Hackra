// oxlint-disable typescript/no-non-null-assertion
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";

import { getUserById } from "@/data/user";
import { prisma } from "@/shared/lib/prisma";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean)
);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (ADMIN_EMAILS.has(user.email)) {
            const userDB = await prisma.user.findUnique({
              where: { id: user.id },
            });
            if (userDB && userDB.role !== "ADMIN") {
              await prisma.user.update({
                data: { role: "ADMIN" },
                where: { id: user.id },
              });
            }
          }
        },
      },
    },
  },
  emailAndPassword: {
    enabled: false,
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.context.newSession) {
        const { user } = ctx.context.newSession;
        if (ADMIN_EMAILS.has(user.email)) {
          const userDB = await prisma.user.findUnique({
            where: { id: user.id },
          });
          if (userDB && userDB.role !== "ADMIN") {
            await prisma.user.update({
              data: { role: "ADMIN" },
              where: { id: user.id },
            });
          }
        }
      }
    }),
  },
  plugins: [
    nextCookies(),
    customSession(async ({ user, session }) => {
      const userDB = await getUserById(user.id);

      return {
        session,
        user: {
          ...userDB,
        },
      };
    }),
  ],
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
      mapProfileToUser: (profile) => ({
        bio: profile.bio,
        githubUsername: profile.login,
        image: profile.avatar_url,
        location: profile.location,
        username: profile.login,
      }),
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        // Extraer username del email (juan.perez@gmail.com → juan.perez)
        const [usernameFromEmail] = profile.email.split("@");
        return {
          githubUsername: null,
          username: usernameFromEmail,
        };
      },
    },
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
  user: {
    additionalFields: {
      bio: {
        required: false,
        type: "string",
      },
      githubUsername: {
        required: false,
        type: "string",
      },
      karmaPoints: {
        required: false,
        type: "number",
      },
      location: {
        required: false,
        type: "string",
      },
      position: {
        // Frontend, Backend, Fullstack, etc.
        required: false,
        type: "string",
      },
      techStack: {
        required: false,
        type: "string[]",
      },
      username: {
        required: true,
        type: "string",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

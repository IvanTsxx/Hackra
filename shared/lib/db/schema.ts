import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  createdAt: timestamp("created_at").defaultNow(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  id: text("id").primaryKey(),
  image: text("image"),
  name: text("name").notNull(),
  role: text("role").default("user"),
  updatedAt: timestamp("updated_at").defaultNow(),
  userType: text("user_type").default("participant"),
});

export const session = pgTable(
  "session",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    id: text("id").primaryKey(),
    ipAddress: text("ip_address"),
    token: text("token").notNull().unique(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    accessToken: text("access_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    accountId: text("account_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    id: text("id").primaryKey(),
    idToken: text("id_token"),
    password: text("password"),
    providerId: text("provider_id").notNull(),
    refreshToken: text("refresh_token"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    value: text("value").notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const hackathons = pgTable("hackathons", {
  accentColor: text("accent_color").default("#3b82f6"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow(),
  description: text("description"),
  endDate: timestamp("end_date").notNull(),
  id: uuid("id").defaultRandom().primaryKey(),
  isVirtual: boolean("is_virtual").default(false),
  location: text("location"),
  longDescription: text("long_description"),
  maxParticipants: integer("max_participants").default(100),
  prizes: jsonb("prizes")
    .$type<{ place: string; prize: string }[]>()
    .default([]),
  published: boolean("published").default(false),
  registrationDeadline: timestamp("registration_deadline"),
  requirements: jsonb("requirements").$type<string[]>().default([]),
  slug: text("slug").notNull().unique(),
  startDate: timestamp("start_date").notNull(),
  technologies: jsonb("technologies").$type<string[]>().default([]),
  title: text("title").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const organizers = pgTable("organizers", {
  createdAt: timestamp("created_at").defaultNow(),
  hackathonId: uuid("hackathon_id")
    .notNull()
    .references(() => hackathons.id, { onDelete: "cascade" }),
  id: uuid("id").defaultRandom().primaryKey(),
  role: text("role").default("organizer"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const participants = pgTable("participants", {
  createdAt: timestamp("created_at").defaultNow(),
  hackathonId: uuid("hackathon_id")
    .notNull()
    .references(() => hackathons.id, { onDelete: "cascade" }),
  id: uuid("id").defaultRandom().primaryKey(),
  status: text("status").default("registered"),
  teamName: text("team_name"),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const verifications = pgTable("verifications", {
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  value: text("value").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(account),
  organizers: many(organizers),
  participants: many(participants),
  sessions: many(session),
}));

export const sessionsRelations = relations(session, ({ one }) => ({
  user: one(users, {
    fields: [session.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(account, ({ one }) => ({
  user: one(users, {
    fields: [account.userId],
    references: [users.id],
  }),
}));

export const hackathonsRelations = relations(hackathons, ({ many }) => ({
  organizers: many(organizers),
  participants: many(participants),
}));

export const organizersRelations = relations(organizers, ({ one }) => ({
  hackathon: one(hackathons, {
    fields: [organizers.hackathonId],
    references: [hackathons.id],
  }),
  user: one(users, {
    fields: [organizers.userId],
    references: [users.id],
  }),
}));

export const participantsRelations = relations(participants, ({ one }) => ({
  hackathon: one(hackathons, {
    fields: [participants.hackathonId],
    references: [hackathons.id],
  }),
  user: one(users, {
    fields: [participants.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Hackathon = typeof hackathons.$inferSelect;
export type NewHackathon = typeof hackathons.$inferInsert;
export type Participant = typeof participants.$inferSelect;
export type Organizer = typeof organizers.$inferSelect;

import * as z from "zod";

export const createHackathonSchema = z.object({
  description: z.string().min(1, "Description is required"),
  endDate: z.coerce.date().optional(),
  externalId: z.string().optional(),

  externalUrl: z.string().url().optional(),
  image: z.string().optional(),
  isPublished: z.boolean().default(false),

  location: z.string().min(1, "Location is required"),
  locationMode: z.enum(["remote", "in_person", "hybrid"]).default("in_person"),
  maxParticipants: z.coerce.number().int().positive().optional(),
  maxTeamSize: z.coerce.number().int().positive().min(1).default(4),
  requiresApproval: z.boolean().default(false),

  source: z.string().default("manual"),
  startDate: z.coerce.date().optional(),

  tags: z.array(z.string()).default([]),
  techs: z.array(z.string()).default([]),
  title: z.string().min(1, "Title is required"),
});

import * as z from "zod";

export const createHackathonSchema = z.object({
  description: z
    .string()
    .min(20, "Description must be at least 20 characters."),
  endDate: z.coerce.date(),
  image: z.string().optional(),
  isPublished: z.boolean().default(false),
  location: z.string().optional(),
  locationMode: z.enum(["remote", "in_person", "hybrid"]),
  maxParticipants: z.coerce.number().int().positive().optional(),
  maxTeamSize: z.coerce.number().int().positive().min(1).default(4),
  requiresApproval: z.boolean().default(false),
  startDate: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  techs: z.array(z.string()).default([]),
  themeBg: z.string().optional(),
  themeGradient: z.string().optional(),
  themeStyle: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters."),
});

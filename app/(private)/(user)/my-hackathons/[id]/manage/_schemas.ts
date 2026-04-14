import * as z from "zod";

export const participantActionSchema = z.object({
  hackathonId: z.string().min(1),
  participantId: z.string().min(1),
});

export const addOrganizerSchema = z.object({
  hackathonId: z.string().min(1),
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username too long")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, underscores and dashes allowed"
    ),
});

export const removeOrganizerSchema = z.object({
  coOrgId: z.string().min(1),
  hackathonId: z.string().min(1),
});

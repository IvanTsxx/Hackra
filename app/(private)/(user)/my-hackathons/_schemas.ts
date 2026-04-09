import * as z from "zod";

export const editHackathonSchema = z
  .object({
    description: z
      .string()
      .min(10, "Description must be at least 10 characters."),
    endDate: z.coerce.date(),
    id: z.string(),
    image: z.string().url("Must be a valid URL.").nullable().optional(),
    isOnline: z.boolean(),
    location: z.string().min(1, "Location is required."),
    locationMode: z.enum(["online", "in_person", "hybrid"]),
    maxParticipants: z.coerce.number().positive().nullable().optional(),
    maxTeamSize: z.coerce
      .number()
      .int()
      .positive("Max team size must be a positive integer."),
    startDate: z.coerce.date(),
    status: z.enum(["DRAFT", "UPCOMING", "ENDED", "CANCELLED"]),
    tags: z.array(z.string()),
    techs: z.array(z.string()),
    title: z.string().min(5, "Title must be at least 5 characters."),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date.",
    path: ["endDate"],
  });

export type EditHackathonDTO = z.infer<typeof editHackathonSchema>;

export const deleteHackathonSchema = z.object({
  id: z.string(),
});

export const participantActionSchema = z.object({
  hackathonId: z.string(),
  participantId: z.string(),
});

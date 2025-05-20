import { z } from "zod";

export const UserEventsSchema = z.array(
  z.object({
    event: z.object({
      event_id: z.string().uuid(),
      event_name: z.string(),
    }),
    assignedAt: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    updated_by: z.string().email().nullable().optional(),
    id: z
      .string()
      .uuid()
      .default(() => crypto.randomUUID()),
  })
);

export type UserEventsSchema = z.infer<typeof UserEventsSchema>;


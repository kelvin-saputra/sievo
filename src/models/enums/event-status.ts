import { z } from "zod";

export const EventStatusEnum = z.enum([
  "PLANNING",
  "BUDGETING",
  "PREPARATION",
  "IMPLEMENTATION",
  "REPORTING",
  "DONE",
]);
export type EventStatusEnum = z.infer<typeof EventStatusEnum>;

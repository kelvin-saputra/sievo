import { z } from "zod";

export const TaskStatusEnum = z.enum([
  "PENDING",
  "ON_PROGRESS",
  "DONE",
  "CANCELLED",
]);
export type TaskStatusEnum = z.infer<typeof TaskStatusEnum>;

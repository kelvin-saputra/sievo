import { z } from "zod";
import { EventSchema } from "../schemas";

export const AddEventDTO = EventSchema.pick({
  event_name: true,
  location: true,
  start_date: true,
  end_date: true,
  notes: true,
  participant_plan: true,
  status: true,
  manager_id: true,
  client_id: true,
});

export const UpdateEventDTO = EventSchema.pick({
  event_name: true,
  location: true,
  start_date: true,
  end_date: true,
  notes: true,
  participant_plan: true,
  status: true,
  manager_id: true,
  client_id: true,
}).partial();

export type AddEventDTO = z.infer<typeof AddEventDTO>;
export type UpdateEventDTO = z.infer<typeof UpdateEventDTO>;

import { z } from "zod";
import { TaskSchema } from "../schemas";

export const AddTaskDTO = TaskSchema.pick({
  title: true,
  description: true,
  assigned_id: true,
  due_date: true,
  status: true,
});

export const UpdateTaskDTO = TaskSchema.pick({
  title: true,
  description: true,
  assigned_id: true,
  due_date: true,
  status: true,
}).partial();

export type AddTaskDTO = z.infer<typeof AddTaskDTO>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskDTO>;

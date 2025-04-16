import { z } from "zod";
import { TaskStatusEnum } from "@/models/enums";

export const TaskSchema = z.object({
  task_id: z
    .string({ required_error: "Task ID wajib diisi" })
    .uuid({ message: "Task ID tidak valid" })
    .default(() => crypto.randomUUID()),
  title: z.string().min(3, { message: "Judul tugas minimal 3 karakter" }),
  description: z.string().optional(),
  assigned_id: z.string().optional(),
  due_date: z.coerce
    .date({ invalid_type_error: "Tanggal jatuh tempo tidak valid" })
    .optional(),
  status: TaskStatusEnum.default("PENDING"),
  created_by: z.string().nonempty({ message: "Dibuat oleh wajib diisi" }),
  updated_by: z.string().nonempty({ message: "Diperbarui oleh wajib diisi" }),
  created_at: z.coerce
    .date({ invalid_type_error: "Tanggal dibuat tidak valid" })
    .default(() => new Date()),
  updated_at: z.coerce
    .date({ invalid_type_error: "Tanggal diperbarui tidak valid" })
    .default(() => new Date()),
  event_id: z
    .string({ required_error: "ID event wajib diisi" })
    .nonempty({ message: "ID event wajib diisi" }),
  is_deleted: z.boolean().default(false),
});

export type TaskSchema = z.infer<typeof TaskSchema>;

// Assigned optional karena bisa aja belum ada yang assign
import { z } from "zod";
import { EventStatusEnum } from "@/models/enums";

export const EventSchema = z.object({
  event_id: z
    .string({ required_error: "ID event wajib diisi" })
    .uuid({ message: "ID event tidak valid" })
    .default(() => crypto.randomUUID()),
  event_name: z.string().min(3, { message: "Nama event minimal 3 karakter" }),
  location: z.string().nonempty({ message: "Lokasi wajib diisi" }),
  start_date: z.coerce.date({
    invalid_type_error: "Tanggal mulai tidak valid",
  }),
  end_date: z.coerce.date({
    invalid_type_error: "Tanggal akhir tidak valid",
  }),
  notes: z.string().optional(),
  participant_plan: z.coerce
    .number({ invalid_type_error: "Jumlah peserta harus berupa angka" })
    .int({ message: "Jumlah peserta harus berupa bilangan bulat" }),
  status: EventStatusEnum.default("PLANNING"),
  manager_id: z.string().nonempty({ message: "ID manager wajib diisi" }),
  client_id: z.string().nonempty({ message: "ID klien wajib diisi" }),
  is_deleted: z.boolean().default(false),
  created_by: z.string().nonempty({ message: "Dibuat oleh wajib diisi" }),
  updated_by: z.string().nonempty({ message: "Diperbarui oleh wajib diisi" }),
  created_at: z.coerce
    .date({ invalid_type_error: "Tanggal dibuat tidak valid" })
    .default(() => new Date()),
  updated_at: z.coerce
    .date({ invalid_type_error: "Tanggal diperbarui tidak valid" })
    .default(() => new Date()),
});

export type EventSchema = z.infer<typeof EventSchema>;

// Make sure Created dan Updated formatnya begini

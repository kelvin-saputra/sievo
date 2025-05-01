import { z } from "zod";
import { UserSchema } from "../schemas";

export const DeleteUserDTO = UserSchema.pick({
    id: true
})

export const GenerateTokenDTO = UserSchema.pick({
    role: true
}).extend({
    duration: z
        .number()
        .min(1, "Duration must be at least 1 second")
})

export const UpdateUserProfileDTO = UserSchema.pick({
    id: true,
    name: true,
    phone_number: true,
    email: true,
    role: true,
    is_active: true,
    started_at: true,
    ended_at: true
}).partial();

export type DeleteUserDTO = z.infer<typeof DeleteUserDTO>;
export type GenerateTokenDTO = z.infer<typeof GenerateTokenDTO>;
export type UpdateUserProfileDTO = z.infer<typeof UpdateUserProfileDTO>;
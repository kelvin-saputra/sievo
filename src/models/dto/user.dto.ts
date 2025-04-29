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

export type DeleteUserDTO = z.infer<typeof DeleteUserDTO>;
export type GenerateTokenDTO = z.infer<typeof GenerateTokenDTO>;
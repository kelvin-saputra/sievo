import { z } from "zod";
import { UserSchema } from "../schemas";

export const LoginDTO = UserSchema.pick({
    email: true,
    password: true
})

export const RegisterDTO = UserSchema.pick({
    name: true,
    email: true,
    password: true, 
    phone_number: true
}).extend({
    token: z.string()
})

export type LoginDTO = z.infer<typeof LoginDTO>;
export type RegisterDTO = z.infer<typeof RegisterDTO>;
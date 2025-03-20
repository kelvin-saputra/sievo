import { UserSchema } from "@/models/schemas";

export const userData = UserSchema.parse({
    id: "60f37eaa-a9fa-4d56-b1a4-2452dfa7a4e5",
    name: "SUPER ADMIN",
    phone_number: "+62819555831",
    email: "super.admin@cracked.com",
    role: "FREELANCE",
    is_active: true,
    is_admin: true,
    started_at: "2021-07-19T00:00:00Z",
    ended_at: null,
});
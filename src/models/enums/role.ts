import { z } from "zod";

export const RoleEnum = z.enum(["EXECUTIVE", "INTERNAL", "FREELANCE", "ADMIN"]);
export type RoleEnum = z.infer<typeof RoleEnum>;

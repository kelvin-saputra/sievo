import { z } from "zod";

export const RoleEnum = z.enum(["EXECUTIVE", "INTERNAL", "FREELANCE"]);
export type RoleEnum = z.infer<typeof RoleEnum>;

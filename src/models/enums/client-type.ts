import { z } from "zod";

export const ClientTypeEnum = z.enum(["INDIVIDUAL", "ORGANIZATION"]);
export type ClientTypeEnum = z.infer<typeof ClientTypeEnum>;

import { z } from "zod";

export const ClientTypeEnum = z.enum(["INDIVIDUAL", "ORGANIZATION", "COMMUNITIES_AND_ORGANIZATION"]);
export type ClientTypeEnum = z.infer<typeof ClientTypeEnum>;

import { z } from "zod";

export const ClientTypeEnum = z.enum([
  "INDIVIDUAL",
  "CORPORATE",
  "GOVERNMENT",
  "EDUCATIONAL_INSTITUTION",
  "COMMUNITIES_AND_ORGANIZATION",
  "COMMERCIAL_BRAND_AND_AGENCY",
]);

export type ClientTypeEnum = z.infer<typeof ClientTypeEnum>;

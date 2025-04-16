import { z } from "zod";

export const VendorServiceCategoryEnum = z.enum([
  "FOOD_AND_BEVERAGES",
  "DECORATION",
  "DOCUMENTATION",
  "ACCOMODATION",
  "ENTERTAINMENT",
  "TRANSPORTATION",
  "OTHERS",
]);
export type VendorServiceCategoryEnum = z.infer<typeof VendorServiceCategoryEnum>;

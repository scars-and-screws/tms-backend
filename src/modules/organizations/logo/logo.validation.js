import { z } from "zod";
import { idSchema } from "../../../core/validation/index.js";

// ! ORGANIZATION LOGO PARAM VALIDATION SCHEMA
export const organizationLogoParamSchema = {
  params: z.object({
    organizationId: idSchema,
  }),
};

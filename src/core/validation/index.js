import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "Invalid email address" })
  .max(255);

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, { message: "Username must be at least 3 characters long" })
  .max(50)
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  });

const passwordSchema = z
  .string()
  .trim()
  .min(6, { message: "Password must be at least 6 characters long" })
  .max(100)
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  });

const nameSchema = z
  .string()
  .trim()
  .min(2, { message: "Name must be at least 2 characters long" })
  .max(100);

const avatarUrlSchema = z.string().url().max(255);

const bioSchema = z.string().trim().max(500);

const headlineSchema = z.string().trim().max(150);

const skillsSchema = z.array(z.string().max(50));

const otpSchema = z
  .string()
  .trim()
  .length(6, { message: "OTP must be exactly 6 digits" })
  .regex(/^\d+$/, {
    message: "OTP must contain only numbers",
  });

const identifierSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, { message: "Username or email is required" });

const idSchema = z.string().uuid({ message: "Invalid ID format" });

const organizationNameSchema = z
  .string()
  .trim()
  .min(2, { message: "Organization name must be at least 2 characters" })
  .max(120, { message: "Organization name must be at most 120 characters" });

const descriptionSchema = z
  .string()
  .trim()
  .max(500, { message: "Description must be at most 500 characters" });

const organizationRoleSchema = z.enum(["OWNER", "ADMIN", "MEMBER"], {
  errorMap: () => ({ message: "Role must be one of OWNER, ADMIN, or MEMBER" }),
});

export {
  usernameSchema,
  passwordSchema,
  nameSchema,
  avatarUrlSchema,
  bioSchema,
  headlineSchema,
  skillsSchema,
  emailSchema,
  otpSchema,
  idSchema,
  identifierSchema,
  organizationNameSchema,
  descriptionSchema,
  organizationRoleSchema,
};

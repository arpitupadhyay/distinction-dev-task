import { z } from "zod";

// Type for Zod validation errors
export type ZodError = {
  errors: Array<{ message: string }>;
};

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "City can only contain letters and spaces"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Country can only contain letters and spaces"),
});

export const userUpdateSchema = userSchema.partial();

export type UserFormData = z.infer<typeof userSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;

export const validateUser = (data: unknown): UserFormData => {
  return userSchema.parse(data);
};

export const validateUserUpdate = (data: unknown): UserUpdateData => {
  return userUpdateSchema.parse(data);
};

import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});

export type UserInput = z.infer<typeof userSchema>;

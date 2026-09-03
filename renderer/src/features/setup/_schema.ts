import { z } from "zod";

export const SetupSchema = z
  .object({
    organizationName: z.string().nonempty("Enter organization name."),
    username: z.string().nonempty("Enter username."),
    firstName: z.string().nonempty("Enter first name."),
    middleName: z.string().optional(),
    lastName: z.string().nonempty("Enter last name."),
    position: z.string().nonempty("Enter position."),
    password: z
      .string()
      .nonempty("Enter your password.")
      .min(4, { error: "Password must be atleast 4 characters" }),
    confirmPassword: z
      .string()
      .nonempty("Confirm your password.")
      .min(4, "Password must be at least 4 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SetupSchemaType = z.infer<typeof SetupSchema>;

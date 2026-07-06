import { z } from "zod";

export const ProfileSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().nonempty("Last name is required."),
  position: z.string().nonempty("Position is required"),
});

export const AccountSchema = z
  .object({
    username: z.string().nonempty("Username is required."),
    currentPassword: z.string().nonempty("Password is required."),
    newPassword: z.string().nonempty("Create new password."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;

export type AccountSchemaType = z.infer<typeof AccountSchema>;

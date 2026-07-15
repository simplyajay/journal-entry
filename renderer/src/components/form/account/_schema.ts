import { z } from "zod";

export const ProfileSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().nonempty("Last name is required."),
  position: z.string().nonempty("Position is required"),
});

export const AccountSchemaBase = z.object({
  username: z.string().nonempty("Username is required."),
  currentPassword: z.string().nonempty("Password is required."),
  newPassword: z.string().optional(),
});

export const AccountSchema = AccountSchemaBase.extend({
  confirmPassword: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.newPassword === undefined || data.newPassword === "") {
    return;
  }

  if (data.confirmPassword === undefined || data.confirmPassword === "") {
    ctx.addIssue({
      code: "custom",
      message: "Please confirm your new password.",
      path: ["confirmPassword"],
    });
    return;
  }

  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });
  }
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;

export type AccountSchemaBaseType = z.infer<typeof AccountSchemaBase>;

export type AccountSchemaType = z.infer<typeof AccountSchema>;

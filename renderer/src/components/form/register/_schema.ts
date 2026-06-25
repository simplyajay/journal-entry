import { z } from "zod";

export const RegisterSchema = z.object({
  userName: z.string().nonempty("Please enter username."),
  firstName: z.string().nonempty("Please enter first name."),
  middleName: z.string().optional(),
  lastName: z.string().nonempty("Please enter last name."),
  position: z.string().nonempty("Please enter position."),
  password: z
    .string()
    .nonempty()
    .min(4, { error: "Password must be atleast 4 characters" }),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().nonempty("Please enter username"),
  password: z.string().nonempty("Please enter your password."),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

import { z } from "zod";

export const toDateOnly = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const JEVSearchSchema = z
  .object({
    keyword: z.string().nonempty("Please enter keyword."),
    startDate: z.date("Select date."),
    endDate: z.date("Select Date."),
  })
  .superRefine((data, ctx) => {
    if (data.startDate > data.endDate) {
      ctx.addIssue({
        code: "custom",
        message: "Start date must be before end date.",
        path: ["endDate"],
      });
    }
  });

export type JEVSearchSchemaType = z.infer<typeof JEVSearchSchema>;

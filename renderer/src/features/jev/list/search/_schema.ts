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
    dateFrom: z.date("Select date."),
    dateTo: z.date("Select Date."),
  })
  .superRefine((data, ctx) => {
    if (data.dateFrom > data.dateTo) {
      ctx.addIssue({
        code: "custom",
        message: "Start date must be before end date.",
        path: ["dateTo"],
      });
    }
  });

export type JEVSearchSchemaType = z.infer<typeof JEVSearchSchema>;

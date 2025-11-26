import * as yup from "yup";
import type { InferType } from "yup";

const clientSchema = yup.object({
  client_name: yup.string().trim().required("Client name is required"),
  contact_person: yup.string().trim().nullable().default(null),
  project_title: yup.string().trim().nullable().default(null),
  hourly_rate: yup
    .string()
    .trim()
    .nullable()
    .default(null)
    .test("is-number-or-empty", "Hourly rate must be a number", (val) => {
      if (val === undefined || val === null || val === "") return true;
      return !isNaN(Number(val));
    }),
  duration_hours: yup
    .string()
    .trim()
    .nullable()
    .default(null)
    .test("is-number-or-empty", "Duration must be a number", (val) => {
      if (val === undefined || val === null || val === "") return true;
      return !isNaN(Number(val));
    }),
  techstack_used: yup.string().trim().nullable().default(""),
  description: yup.string().trim().nullable().default(null),
});

export type ClientFormValues = InferType<typeof clientSchema>;
export default clientSchema;

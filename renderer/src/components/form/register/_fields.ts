import type { RegisterSchemaType } from "./_schema";
import type { InputField } from "@/components/common/field/_types";

export const firstRow = (
  loading: boolean,
): InputField<RegisterSchemaType>[] => [
  { name: "userName", label: "Username", type: "text", disabled: loading },
  { name: "password", label: "Password", type: "password", disabled: loading },
];

export const secondRow = (
  loading: boolean,
): InputField<RegisterSchemaType>[] => [
  { name: "firstName", label: "First Name", type: "text", disabled: loading },
  { name: "lastName", label: "Last Name", type: "text", disabled: loading },
];

export const thirdRow = (
  loading: boolean,
): InputField<RegisterSchemaType>[] => [
  { name: "middleName", label: "Middle Name", type: "text", disabled: loading },
  { name: "position", label: "Position", type: "text", disabled: loading },
];

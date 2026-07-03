import type { SetupSchemaType } from "./_schema";
import type { InputField } from "@/components/common/field/_types";

export const organizationSection = (
  loading: boolean,
): InputField<SetupSchemaType>[] => [
  {
    name: "organizationName",
    label: "Name",
    placeholder: "e.g. Department of Finance",
    type: "text",
    disabled: loading,
  },
];

export const accountSection = (
  loading: boolean,
): InputField<SetupSchemaType>[] => [
  {
    name: "username",
    label: "Username",
    placeholder: "e.g. jdelacruz",
    type: "text",
    disabled: loading,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Create a password",
    type: "password",
    disabled: loading,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Re-enter password",
    type: "password",
    disabled: loading,
  },
];

export const personalInfoSection = (
  loading: boolean,
): InputField<SetupSchemaType>[] => [
  {
    name: "firstName",
    label: "First Name",
    placeholder: "e.g. Juan",
    type: "text",
    disabled: loading,
  },
  {
    name: "middleName",
    label: "Middle Name",
    placeholder: "e.g. Santos (optional)",
    type: "text",
    disabled: loading,
  },
  {
    name: "lastName",
    label: "Last Name",
    placeholder: "e.g. dela Cruz",
    type: "text",
    disabled: loading,
  },
];

export const roleSection = (
  loading: boolean,
): InputField<SetupSchemaType>[] => [
  {
    name: "position",
    label: "Position",
    placeholder: "e.g. Budget Officer",
    type: "text",
    disabled: loading,
  },
];

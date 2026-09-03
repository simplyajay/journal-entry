import type { InputField } from "@/components/common/field/_types";
import type { AccountSchemaType, ProfileSchemaType } from "./_schema";

export const profileFormFields = (
  loading: boolean,
): InputField<ProfileSchemaType>[] => [
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
  {
    name: "position",
    label: "Position",
    placeholder: "e.g. Budget Officer",
    type: "text",
    disabled: loading,
  },
];

export const accountFormFields = (
  loading: boolean,
): InputField<AccountSchemaType>[] => [
  {
    name: "username",
    label: "Username",
    placeholder: "e.g. jdelacruz",
    type: "text",
    disabled: loading,
  },
  {
    name: "currentPassword",
    label: "Current Password",
    placeholder: "Enter current password",
    type: "password",
    disabled: loading,
  },
  {
    name: "newPassword",
    label: "New Password",
    placeholder: "Create a new password.",
    type: "password",
    disabled: loading,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Re-enter new password.",
    type: "password",
    disabled: loading,
  },
];

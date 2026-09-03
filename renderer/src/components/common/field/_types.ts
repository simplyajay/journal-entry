import { INPUT_VARIANTS } from "./_styles";
import type { InputHTMLAttributes } from "react";
import type {
  FieldValues,
  Path,
  UseFormRegister,
  Control,
  FieldErrors,
  UseFormClearErrors,
  FieldPath,
} from "react-hook-form";

export type InputVariant = keyof typeof INPUT_VARIANTS;

export type InputType =
  | "text"
  | "select"
  | "combobox"
  | "date-picker"
  | "textarea"
  | "number"
  | "currency"
  | "password";

export type SelectOptions = { label: string; value: string };

export type ComboOption = {
  label: string;
  value: string;
  data?: Record<string, string | number | undefined>;
};

export type BaseInputProps<T extends FieldValues> =
  InputHTMLAttributes<HTMLInputElement> & {
    fieldName: Path<T>;
    errors: FieldErrors<T>;
    clearErrors: UseFormClearErrors<T>;
    variant?: InputVariant;
  };

export type RegisterInputProps<T extends FieldValues> = BaseInputProps<T> & {
  register: UseFormRegister<T>;
};

export type ControllerInputProps<T extends FieldValues> = BaseInputProps<T> & {
  control: Control<T>;
};

export type SelectInputProps<T extends FieldValues> =
  ControllerInputProps<T> & {
    options: SelectOptions[];
    placeholder?: string;
    onValueChange?: (value: string) => void;
  };

export type ComboboxInputProps<T extends FieldValues> =
  ControllerInputProps<T> & {
    options: ComboOption[];
    placeholder?: string;
    allowCustom?: boolean;
    emptyMessage?: string;
    maxResults?: number;
  };

export type InputField<T extends FieldValues> = {
  name: FieldPath<T>;
  placeholder?: string;
  label?: string;
  error?: string;
  type: InputType;
  disabled?: boolean;
  options?: SelectOptions[] | ComboOption[];
  /**
   * A13: runs after the field's own onChange, for the caller that needs to
   * react to a selection (e.g. clearing type-specific fields when the
   * journal type changes). Only wired for `select` today.
   */
  onValueChange?: (value: string) => void;
  // A12: combobox-only knobs, previously unreachable through InputRenderer.
  allowCustom?: boolean;
  emptyMessage?: string;
  maxResults?: number;
};

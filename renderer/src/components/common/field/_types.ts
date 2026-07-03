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
  | "date-picker"
  | "textarea"
  | "number"
  | "currency"
  | "password";

export type SelectOptions = { label: string; value: string };

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
  };

export type CurrencyInputProps<T extends FieldValues> =
  ControllerInputProps<T> & {
    onChange: (value: number | undefined) => void;
  };

export type InputField<T extends FieldValues> = {
  name: FieldPath<T>;
  placeholder?: string;
  label?: string;
  error?: string;
  type: InputType;
  disabled?: boolean;
  options?: SelectOptions[];
};

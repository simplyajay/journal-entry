import clsx from "clsx";
import { Input } from "../ui/input";
import { useFieldBase } from "./_useFieldBase";
import { withFieldWrapper } from "./withFieldWrapper";
import { INPUT_BASE, INPUT_VARIANTS } from "./_styles";
import type { RegisterInputProps } from "./_types";
import type { FieldValues } from "react-hook-form";
import type { WithFieldWrapperProps } from "./withFieldWrapper";

export const TextInput = <T extends FieldValues>({
  register,
  fieldName,
  variant = "default",
  type = "text",
  className,
  errors,
  disabled,
  placeholder,
  clearErrors,
}: RegisterInputProps<T>) => {
  const { errorMessage, onFocus } = useFieldBase({
    fieldName,
    clearErrors,
    errors,
  });

  return (
    <Input
      {...register(fieldName)}
      className={clsx(INPUT_BASE, INPUT_VARIANTS[variant], className, {
        "bg-muted": disabled,
      })}
      aria-invalid={!!errorMessage}
      placeholder={placeholder}
      onFocus={onFocus}
      disabled={disabled}
      type={type}
    />
  );
};

export const LabeledTextInput = withFieldWrapper(TextInput) as <
  T extends FieldValues,
>(
  props: RegisterInputProps<T> & WithFieldWrapperProps,
) => React.ReactElement;

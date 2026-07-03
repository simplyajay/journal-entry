import clsx from "clsx";
import { useFieldBase } from "./_useFieldBase";
import { Textarea } from "../ui/textarea";
import { withFieldWrapper } from "./withFieldWrapper";
import { INPUT_BASE, INPUT_VARIANTS } from "./_styles";
import type { FieldValues } from "react-hook-form";
import type { RegisterInputProps } from "./_types";
import type { WithFieldWrapperProps } from "./withFieldWrapper";

export const TextArea = <T extends FieldValues>({
  register,
  fieldName,
  placeholder,
  className,
  variant = "default",
  clearErrors,
  errors,
  disabled,
}: RegisterInputProps<T>) => {
  const { errorMessage, onFocus } = useFieldBase({
    fieldName,
    clearErrors,
    errors,
  });

  return (
    <Textarea
      {...register(fieldName)}
      disabled={disabled}
      aria-invalid={!!errorMessage}
      className={clsx(
        INPUT_BASE,
        INPUT_VARIANTS[variant],
        "disabled:cursor-none",
        className,
      )}
      placeholder={placeholder}
      onFocus={onFocus}
    />
  );
};

export const LabeledTextArea = withFieldWrapper(TextArea) as <
  T extends FieldValues,
>(
  props: RegisterInputProps<T> & WithFieldWrapperProps,
) => React.ReactElement;

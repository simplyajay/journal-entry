import clsx from "clsx";
import { Input } from "../ui/input";
import { useFieldBase } from "./_useFieldBase";
import { withFieldWrapper } from "./withFieldWrapper";
import { INPUT_BASE, INPUT_VARIANTS } from "./_styles";
import { blockInvalidNumberKeys, blockPaste } from "../lib/utils";
import type { RegisterInputProps } from "./_types";
import type { FieldValues } from "react-hook-form";
import type { WithFieldWrapperProps } from "./withFieldWrapper";

export const NumberInput = <T extends FieldValues>({
  register,
  fieldName,
  variant = "default",
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
      {...register(fieldName, { valueAsNumber: true })}
      className={clsx(INPUT_BASE, INPUT_VARIANTS[variant], className, {
        "bg-muted": disabled,
      })}
      inputMode="decimal"
      spellCheck={false}
      type="number"
      aria-invalid={!!errorMessage}
      placeholder={placeholder}
      onFocus={onFocus}
      onKeyDown={blockInvalidNumberKeys}
      onPaste={blockPaste}
    />
  );
};

export const LabeledNumberInput = withFieldWrapper(NumberInput) as <
  T extends FieldValues,
>(
  props: RegisterInputProps<T> & WithFieldWrapperProps,
) => React.ReactElement;

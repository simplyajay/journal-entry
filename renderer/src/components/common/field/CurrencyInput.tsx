import clsx from "clsx";
import { useState } from "react";
import { useFieldBase } from "./_useFieldBase";
import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { withFieldWrapper } from "./withFieldWrapper";
import { formatNumber } from "@/lib/money";
import { blockInvalidNumberKeys, blockPaste } from "@/lib/utils";
import { INPUT_BASE, INPUT_VARIANTS } from "./_styles";
import type { FieldValues } from "react-hook-form";
import type { ControllerInputProps } from "./_types";
import type { WithFieldWrapperProps } from "./withFieldWrapper";

export const CurrencyInput = <T extends FieldValues>({
  fieldName,
  control,
  placeholder,
  className,
  variant = "default",
  disabled,
  clearErrors,
  errors,
}: ControllerInputProps<T>) => {
  const { errorMessage, onFocus } = useFieldBase({
    fieldName,
    clearErrors,
    errors,
  });

  const [draft, setDraft] = useState<string | null>(null);

  const display = (value: number | undefined) =>
    value != null && !isNaN(value) ? formatNumber(value) : "";

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <Input
          className={clsx(INPUT_BASE, INPUT_VARIANTS[variant], className)}
          inputMode="decimal"
          placeholder={placeholder}
          spellCheck={false}
          aria-invalid={!!errorMessage}
          disabled={disabled}
          value={draft ?? display(field.value)}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => {
            onFocus();
            setDraft(field.value != null ? String(field.value) : "");
          }}
          onBlur={() => {
            const parsed = parseFloat((draft ?? "").replace(/,/g, ""));
            field.onChange(isNaN(parsed) ? undefined : parsed);
            setDraft(null);
            field.onBlur();
          }}
          onKeyDown={blockInvalidNumberKeys}
          onPaste={blockPaste}
        />
      )}
    />
  );
};

export const LabeledCurrencyInput = withFieldWrapper(CurrencyInput) as <
  T extends FieldValues,
>(
  props: ControllerInputProps<T> & WithFieldWrapperProps,
) => React.ReactElement;

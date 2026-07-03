import clsx from "clsx";
import { useFieldBase } from "./_useFieldBase";
import { useState, useRef } from "react";
import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { withFieldWrapper } from "./withFieldWrapper";
import { formatNumber } from "../lib/utils";
import { blockInvalidNumberKeys, blockPaste } from "../lib/utils";
import { INPUT_BASE, INPUT_VARIANTS } from "./_styles";
import type { FieldValues } from "react-hook-form";
import type { CurrencyInputProps } from "./_types";
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
}: CurrencyInputProps<T>) => {
  const { errorMessage, onFocus } = useFieldBase({
    fieldName,
    clearErrors,
    errors,
  });

  const [displayValue, setDisplayValue] = useState("");

  const rawRef = useRef<string>("");

  const handleFocus = (value: number | undefined) => {
    const raw = value != null ? String(value) : "";
    rawRef.current = raw;
    setDisplayValue(raw);
  };

  const handleBlur = (onChange: (value: number | undefined) => void) => {
    const parsed = parseFloat(rawRef.current.replace(/,/g, ""));
    if (isNaN(parsed)) {
      onChange(undefined);
      setDisplayValue("");
    } else {
      onChange(parsed);
      setDisplayValue(formatNumber(parsed));
    }
  };

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <Input
          className={clsx(INPUT_BASE, INPUT_VARIANTS[variant], className)}
          inputMode="decimal"
          placeholder={placeholder}
          aria-invalid={!!errorMessage}
          disabled={disabled}
          value={displayValue}
          onChange={(e) => {
            rawRef.current = e.target.value;
            setDisplayValue(e.target.value);
          }}
          onFocus={() => {
            onFocus();
            handleFocus(field.value);
          }}
          onBlur={() => handleBlur(field.onChange)}
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
  props: CurrencyInputProps<T> & WithFieldWrapperProps,
) => React.ReactElement;

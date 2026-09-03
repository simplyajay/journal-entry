import clsx from "clsx";
import { useFieldBase } from "./_useFieldBase";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";
import { INPUT_BASE, INPUT_VARIANTS } from "./_styles";
import { withFieldWrapper } from "./withFieldWrapper";
import type { SelectInputProps } from "./_types";
import type { FieldValues } from "react-hook-form";
import type { WithFieldWrapperProps } from "./withFieldWrapper";

export const SelectInput = <T extends FieldValues>({
  fieldName,
  control,
  placeholder,
  className,
  options,
  variant = "default",
  disabled,
  clearErrors,
  errors,
  onValueChange,
}: SelectInputProps<T>) => {
  const { errorMessage } = useFieldBase({ fieldName, clearErrors, errors });

  return (
    <Controller
      name={fieldName}
      control={control}
      disabled={disabled}
      render={({ field }) => (
        <Select
          value={field.value ?? ""}
          onValueChange={(val) => {
            field.onChange(val || undefined);
            onValueChange?.(val);
          }}
        >
          <SelectTrigger
            className={clsx(
              INPUT_BASE,
              INPUT_VARIANTS[variant],
              "group truncate",
              className,
            )}
            disabled={field.disabled}
            aria-invalid={!!errorMessage}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="w-(--radix-select-trigger-width)"
          >
            <SelectGroup>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-sm"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  );
};

export const LabeledSelectInput = withFieldWrapper(SelectInput) as <
  T extends FieldValues,
>(
  props: SelectInputProps<T> & WithFieldWrapperProps,
) => React.ReactElement;

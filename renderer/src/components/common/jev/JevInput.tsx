import { useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Field } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input as InputBase } from "../ui/input";
import { blockPaste, blockInvalidNumberKeys, formatNumber } from "../lib/utils";
import {
  Select as SelectBase,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea as TextAreaBase } from "../ui/textarea";
import { Controller, get } from "react-hook-form";
import type { InputHTMLAttributes } from "react";
import type {
  Control,
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
  UseFormClearErrors,
} from "react-hook-form";
import type { SelectOptions } from "@/features/journal/types";

export type InputType =
  | "text"
  | "select"
  | "date-picker"
  | "textarea"
  | "number"
  | "currency";

const INPUT_BASE =
  "w-full min-w-0 min-h-12 p-2 font-manrope text-lg text-gray-800 rounded-sm border border-ring ";

const TABLE_INPUT_BASE =
  "w-full min-w-0 min-h-12 p-2 font-manrope text-lg focus-visible:ring-1 text-gray-800 border-transparent rounded-sm bg-transparent hover:bg-white";

type BaseProps<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  fieldName: Path<T>;
  type: InputType;
  register: UseFormRegister<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
  clearErrors: UseFormClearErrors<T>;
  variant?: "default" | "table";
};

type SelectInputProps<T extends FieldValues> = BaseProps<T> & {
  options: SelectOptions[];
  placeholder?: string;
};

type CurrencyInputBaseProps<T extends FieldValues> = BaseProps<T> & {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

type WithFieldWrapperProps<T extends FieldValues> = {
  label?: string;
  errors: FieldErrors<T>;
};

type JevInputProps<T extends FieldValues> = BaseProps<T> &
  WithFieldWrapperProps<T> &
  Partial<Pick<SelectInputProps<T>, "options" | "placeholder">>;

export const WithFieldWrapper = <T extends FieldValues, P extends BaseProps<T>>(
  Component: React.ComponentType<P>,
) => {
  const WrappedField = (props: P & WithFieldWrapperProps<T>) => {
    const errorMessage = get(props.errors, props.fieldName)?.message as
      | string
      | undefined;

    return (
      <div className="flex-1 font-manrope text-lg flex flex-col gap-1">
        {props.label && <p className="font-poppins-300  text-gray-800">{props.label}</p>}

        <Component {...props} />

        <div className={`${props.variant === "table" ? "min-h-0" : "min-h-8"}`}>
          {errorMessage && (
            <p className="font-poppins-300 text-base text-red-500">{errorMessage}</p>
          )}
        </div>
      </div>
    );
  };

  return WrappedField;
};

export const Select = <T extends FieldValues>(props: SelectInputProps<T>) => {
  const { fieldName, control, placeholder, options, variant, disabled } = props;

  const errorMessage = get(props.errors, props.fieldName)?.message as string | undefined;

  return (
    <Controller
      name={fieldName}
      control={control}
      disabled={disabled}
      render={({ field }) => (
        <SelectBase
          value={field.value ?? ""}
          onValueChange={(val) => field.onChange(val || undefined)}
        >
          <SelectTrigger
            className={`${INPUT_BASE} w-full truncate group ${variant === "table" ? "border-transparent bg-transparent hover:bg-white" : ""}`}
            disabled={field.disabled}
            aria-invalid={!!errorMessage}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent position="popper" className="w-(--radix-select-trigger-width)">
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-lg ">
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </SelectBase>
      )}
    />
  );
};

export const DatePicker = <T extends FieldValues>(props: BaseProps<T>) => {
  const { control, fieldName, placeholder, clearErrors, variant, disabled } = props;

  const errorMessage = get(props.errors, props.fieldName)?.message as string | undefined;

  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={fieldName}
      control={control}
      disabled={disabled}
      render={({ field }) => (
        <Field className="w-full">
          <Popover
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              clearErrors(fieldName);
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                id="date"
                aria-invalid={!!errorMessage}
                disabled={field.disabled}
                className={`${INPUT_BASE} bg-transparent justify-start ${field.value ? "" : "text-muted-foreground hover:text-muted-foreground"} ${variant === "table" ? "border-transparent bg-transparent hover:bg-white" : ""} ${disabled ? "bg-muted" : ""} data-[state=open]:text-muted-foreground`}
              >
                {field.value ? field.value.toLocaleDateString() : placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                className="rounded-lg border [--cell-size:--spacing(9)] md:[--cell-size:--spacing(10)]"
                defaultMonth={field.value}
                captionLayout="dropdown"
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>
      )}
    />
  );
};

export const Input = <T extends FieldValues>(props: BaseProps<T>) => {
  const {
    register,
    fieldName,
    type,
    placeholder,
    clearErrors,
    variant,
    disabled,
    className,
  } = props;

  const errorMessage = get(props.errors, props.fieldName)?.message as string | undefined;

  const styles = variant === "table" ? TABLE_INPUT_BASE : INPUT_BASE;

  return (
    <InputBase
      {...register(fieldName, { valueAsNumber: type === "number", disabled })}
      className={`${styles} ${errorMessage ? "" : ""} ${disabled ? "bg-muted" : ""} ${className}`}
      inputMode={type === "number" ? "decimal" : undefined}
      type={type}
      aria-invalid={!!errorMessage}
      placeholder={placeholder}
      onFocus={() => clearErrors(fieldName)}
      onKeyDown={type === "number" ? blockInvalidNumberKeys : undefined}
      onPaste={type === "number" ? blockPaste : undefined}
    />
  );
};

const CurrencyInputBase = <T extends FieldValues>(props: CurrencyInputBaseProps<T>) => {
  const {
    placeholder,
    clearErrors,
    fieldName,
    variant,
    disabled,
    className,
    value,
    onChange,
  } = props;

  const errorMessage = get(props.errors, props.fieldName)?.message as string | undefined;
  const styles = variant === "table" ? TABLE_INPUT_BASE : INPUT_BASE;

  const [displayValue, setDisplayValue] = useState(
    value != null ? formatNumber(value) : "",
  );
  const rawRef = useRef<string>("");

  const onFocus = () => {
    const raw = value != null ? String(value) : "";
    rawRef.current = raw;
    setDisplayValue(raw);
  };

  const onBlur = () => {
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
    <InputBase
      className={`${styles} ${className}`}
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
        clearErrors(fieldName);
        onFocus();
      }}
      onBlur={onBlur}
      onKeyDown={blockInvalidNumberKeys}
      onPaste={blockPaste}
    />
  );
};

export const CurrencyInput = <T extends FieldValues>(props: BaseProps<T>) => {
  const { control, fieldName } = props;

  return (
    <Controller
      name={fieldName}
      control={control}
      render={({ field }) => (
        <CurrencyInputBase {...props} value={field.value} onChange={field.onChange} />
      )}
    />
  );
};

export const TextArea = <T extends FieldValues>(props: BaseProps<T>) => {
  const { register, fieldName, placeholder, clearErrors, disabled } = props;

  const errorMessage = get(props.errors, props.fieldName)?.message as string | undefined;

  return (
    <TextAreaBase
      {...register(fieldName)}
      disabled={disabled}
      aria-invalid={!!errorMessage}
      className={`${INPUT_BASE} ${props.className} disabled:cursor-none`}
      placeholder={placeholder}
      onFocus={() => clearErrors(fieldName)}
    />
  );
};

export const JevInput = <T extends FieldValues>(props: JevInputProps<T>) => {
  const renderers = useMemo(
    () => ({
      text: WithFieldWrapper<T, BaseProps<T>>(Input as React.ComponentType<BaseProps<T>>),
      number: WithFieldWrapper<T, BaseProps<T>>(
        Input as React.ComponentType<BaseProps<T>>,
      ),
      currency: WithFieldWrapper<T, BaseProps<T>>(
        CurrencyInput as React.ComponentType<BaseProps<T>>,
      ),
      select: WithFieldWrapper<T, SelectInputProps<T>>(
        Select as React.ComponentType<SelectInputProps<T>>,
      ),
      "date-picker": WithFieldWrapper<T, BaseProps<T>>(
        DatePicker as React.ComponentType<BaseProps<T>>,
      ),
      textarea: WithFieldWrapper<T, BaseProps<T>>(
        TextArea as React.ComponentType<BaseProps<T>>,
      ),
    }),
    [],
  ) as Record<InputType, React.ComponentType<any>>;

  const Renderer = renderers[props.type];
  return <Renderer {...(props as any)} />;
};

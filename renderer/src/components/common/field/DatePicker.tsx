import clsx from "clsx";
import { useState } from "react";
import { useFieldBase } from "./_useFieldBase";
import { withFieldWrapper } from "./withFieldWrapper";
import { Controller } from "react-hook-form";
import { Field } from "../ui/field";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { INPUT_BASE, INPUT_VARIANTS } from "./_styles";
import type { ControllerInputProps } from "./_types";
import type { FieldValues } from "react-hook-form";
import type { WithFieldWrapperProps } from "./withFieldWrapper";

export const DatePicker = <T extends FieldValues>({
  control,
  fieldName,
  placeholder,
  clearErrors,
  errors,
  variant = "default",
  disabled,
}: ControllerInputProps<T>) => {
  const { errorMessage } = useFieldBase({ fieldName, clearErrors, errors });

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
                className={clsx(
                  "px-2 py-1",
                  INPUT_BASE,
                  "justify-start bg-transparent",
                  "data-[state=open]:text-muted-foreground",
                  INPUT_VARIANTS[variant],
                  {
                    "text-muted-foreground hover:text-muted-foreground":
                      !field.value,
                    "bg-muted": disabled,
                  },
                )}
              >
                {field.value ? field.value.toLocaleDateString() : placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
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

export const LabeledDatePicker = withFieldWrapper(DatePicker) as <
  T extends FieldValues,
>(
  props: ControllerInputProps<T> & WithFieldWrapperProps,
) => React.ReactElement;

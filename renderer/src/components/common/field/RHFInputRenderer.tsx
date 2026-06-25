import { fieldMap } from "./_constants";
import type { FieldValues } from "react-hook-form";
import type { InputField, InputVariant } from "./_types";
import type { UseFormReturn } from "react-hook-form";

type RendererProps<T extends FieldValues, K extends FieldValues = T> = {
  field: InputField<T>;
  form: UseFormReturn<K>;
  /**
   * Overrides `field.name` as the RHF field path.
   * Use when rendering inside a dynamic list (e.g. `accountingEntries.0.debit`)
   * to scope the field correctly within the parent form's namespace.
   */
  fieldName?: string;
  /**
   * Overrides `field.disabled`.
   */
  disabled?: boolean;
  variant?: InputVariant;
};

/**
 * Renders an input component from an `InputField` configuration.
 *
 * Intended for dynamic form generation and field-array rendering where
 * inputs are created through loops rather than manually written JSX.
 */
export const InputRenderer = <
  T extends FieldValues,
  K extends FieldValues = T,
>({
  field,
  form,
  fieldName,
  variant,
  disabled,
}: RendererProps<T, K>) => {
  const { register, control, clearErrors, formState } = form;
  const { errors } = formState;

  const Component = fieldMap[field.type];

  return (
    <Component
      fieldName={fieldName ?? field.name}
      label={variant === "table" ? undefined : field.label}
      placeholder={field.placeholder}
      type={field.type}
      variant={variant}
      register={register}
      options={field.options ?? undefined}
      control={control}
      errors={errors}
      clearErrors={clearErrors}
      disabled={disabled ?? field.disabled}
    />
  );
};

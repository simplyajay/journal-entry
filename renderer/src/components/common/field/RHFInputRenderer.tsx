import { LabeledTextInput } from "./TextInput";
import { LabeledNumberInput } from "./NumberInput";
import { LabeledCurrencyInput } from "./CurrencyInput";
import { LabeledSelectInput } from "./SelectInput";
import { LabeledCombobox } from "./Combobox";
import { LabeledDatePicker } from "./DatePicker";
import { LabeledTextArea } from "./TextArea";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import type {
  ComboOption,
  InputField,
  InputVariant,
  SelectOptions,
} from "./_types";

type RendererProps<T extends FieldValues, K extends FieldValues = T> = {
  field: InputField<T>;
  form: UseFormReturn<K>;
  /**
   * Overrides `field.name` as the RHF field path.
   * Use when rendering inside a dynamic list (e.g. `accountingEntries.0.debit`)
   * to scope the field correctly within the parent form's namespace.
   */
  fieldName?: FieldPath<K>;
  /**
   * Overrides `field.disabled`.
   */
  disabled?: boolean;
  variant?: InputVariant;
};

/**
 * Renders an input component from an `InputField` configuration.
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

  const shared = {
    fieldName: (fieldName ?? field.name) as FieldPath<K>,
    label: variant === "table" ? undefined : field.label,
    placeholder: field.placeholder,
    variant,
    errors,
    clearErrors,
    disabled: disabled ?? field.disabled,
  };

  switch (field.type) {
    case "text":
    case "password":
      return (
        <LabeledTextInput {...shared} register={register} type={field.type} />
      );

    case "number":
      return <LabeledNumberInput {...shared} register={register} />;

    case "textarea":
      return <LabeledTextArea {...shared} register={register} />;

    case "currency":
      return <LabeledCurrencyInput {...shared} control={control} />;

    case "date-picker":
      return <LabeledDatePicker {...shared} control={control} />;

    case "select":
      return (
        <LabeledSelectInput
          {...shared}
          control={control}
          options={(field.options ?? []) as SelectOptions[]}
          onValueChange={field.onValueChange}
        />
      );

    case "combobox":
      return (
        <LabeledCombobox
          {...shared}
          control={control}
          options={(field.options ?? []) as ComboOption[]}
          allowCustom={field.allowCustom}
          emptyMessage={field.emptyMessage}
          maxResults={field.maxResults}
        />
      );
  }
};

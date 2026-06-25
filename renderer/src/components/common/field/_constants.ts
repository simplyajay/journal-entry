import type React from "react";
import { LabeledTextInput } from "@/components/common/field/TextInput";
import { LabeledNumberInput } from "@/components/common/field/NumberInput";
import { LabeledCurrencyInput } from "@/components/common/field/CurrencyInput";
import { LabeledSelectInput } from "@/components/common/field/SelectInput";
import { LabeledDatePicker } from "@/components/common/field/DatePicker";
import { LabeledTextArea } from "@/components/common/field/TextArea";
import type { InputType } from "./_types";

export const INPUT_BASE =
  "w-full min-w-0 min-h-12 p-2 font-manrope text-lg text-gray-800 ";

export const INPUT_VARIANTS = {
  default: "border border-ring rounded-sm",
  table:
    "border-transparent rounded-sm bg-transparent focus-visible:ring-1 hover:bg-white",
} as const;

export const fieldMap: Record<InputType, React.ComponentType<any>> = {
  text: LabeledTextInput,
  password: LabeledTextInput,
  number: LabeledNumberInput,
  currency: LabeledCurrencyInput,
  select: LabeledSelectInput,
  "date-picker": LabeledDatePicker,
  textarea: LabeledTextArea,
};

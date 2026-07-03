import type React from "react";
import { LabeledTextInput } from "@/components/common/field/TextInput";
import { LabeledNumberInput } from "@/components/common/field/NumberInput";
import { LabeledCurrencyInput } from "@/components/common/field/CurrencyInput";
import { LabeledSelectInput } from "@/components/common/field/SelectInput";
import { LabeledDatePicker } from "@/components/common/field/DatePicker";
import { LabeledTextArea } from "@/components/common/field/TextArea";
import type { InputType } from "./_types";

export const fieldMap: Record<InputType, React.ComponentType<any>> = {
  text: LabeledTextInput,
  password: LabeledTextInput,
  number: LabeledNumberInput,
  currency: LabeledCurrencyInput,
  select: LabeledSelectInput,
  "date-picker": LabeledDatePicker,
  textarea: LabeledTextArea,
};

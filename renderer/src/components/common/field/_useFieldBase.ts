import { get } from "react-hook-form";
import type {
  Path,
  UseFormClearErrors,
  FieldErrors,
  FieldValues,
} from "react-hook-form";

type UseFieldBaseProps<T extends FieldValues> = {
  fieldName: Path<T>;
  clearErrors: UseFormClearErrors<T>;
  errors: FieldErrors<T>;
};

type UseFieldBaseReturn = {
  errorMessage?: string;
  onFocus: () => void;
};

export const useFieldBase = <T extends FieldValues>({
  fieldName,
  clearErrors,
  errors,
}: UseFieldBaseProps<T>): UseFieldBaseReturn => {
  const errorMessage = get(errors, fieldName)?.message;

  return {
    errorMessage,
    onFocus: () => clearErrors(fieldName),
  };
};

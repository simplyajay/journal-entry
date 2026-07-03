import { get } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import type { BaseInputProps } from "./_types";

export type WithFieldWrapperProps = {
  label?: string;
};

export const withFieldWrapper = <
  T extends FieldValues,
  P extends BaseInputProps<T>,
>(
  Component: React.ComponentType<P>,
) => {
  const WrappedField = (props: P & WithFieldWrapperProps) => {
    const errorMessage = get(props.errors, props.fieldName)?.message as
      | string
      | undefined;

    return (
      <div className="font-manrope-600 flex flex-1 flex-col gap-1 text-sm">
        {props.label && <p className="text-xs text-gray-700">{props.label}</p>}

        <Component {...props} />

        {errorMessage && (
          <p className="font-manrope text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  };

  return WrappedField;
};

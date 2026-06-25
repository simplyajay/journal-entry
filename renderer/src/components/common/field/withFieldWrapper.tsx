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
      <div className="font-manrope flex flex-1 flex-col gap-1 text-lg">
        {props.label && (
          <p className="font-manrope text-gray-800">{props.label}</p>
        )}

        <Component {...props} />

        <div className={`${props.variant === "table" ? "min-h-0" : "min-h-8"}`}>
          {errorMessage && (
            <p className="font-manrope text-base text-red-500">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    );
  };

  return WrappedField;
};

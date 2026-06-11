import React from "react";
import { type InputType, JevInput } from "./JevInput";
import { Button } from "../ui/button";
import {
  Table as TableBase,
  TableHeader as TableHeaderBase,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "../ui/table";
import { PlusIcon, Trash2 } from "lucide-react";
import { useWatch } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  FieldValues,
  UseFormClearErrors,
  UseFormRegister,
  Path,
  FieldPath,
} from "react-hook-form";
import type { SelectOptions } from "@/features/journal/types";

export type TableColumn<TRow extends FieldValues> = {
  name: FieldPath<TRow>;
  label: string;
  type: InputType;
  placeholder?: string;
  width?: string;
  disabled?: boolean;
  options?: SelectOptions[];
  getDisabled?: (row: TRow) => boolean;
};

type JevTableProps<TRow extends FieldValues, TForm extends FieldValues> = {
  columns: TableColumn<TRow>[];
  fields: (TRow & { id: string })[];
  name: Path<TForm>;
  register: UseFormRegister<TForm>;
  control: Control<TForm>;
  errors: FieldErrors<TForm>;
  clearErrors: UseFormClearErrors<TForm>;
  append: (value: TRow) => void;
  remove: (index: number) => void;
  defaultRow: TRow;
  footerClass?: string;
  footerContent?: React.ReactNode;
  customErrorPaths?: Path<TForm>[];
  isOptional?: boolean;
  disabled?: boolean;
};

export function JevTable<TRow extends FieldValues, TForm extends FieldValues>({
  columns,
  fields,
  name,
  clearErrors,
  register,
  control,
  errors,
  append,
  remove,
  defaultRow,
  footerContent,
  footerClass,
  customErrorPaths,
  isOptional,
  disabled,
}: JevTableProps<TRow, TForm>) {
  const watchedFields = useWatch({ control, name });

  const clearRowErrors = (rowIndex: number) => {
    columns.forEach((col) => {
      clearErrors(`${name}.${rowIndex}.${String(col.name)}` as Path<TForm>);
    });
    customErrorPaths?.forEach((path) => clearErrors(path));
  };
  return (
    <TableBase className={`table-fixed ${disabled ? "bg-muted" : ""} rounded-b-lg`}>
      <TableHeaderBase>
        <TableRow className="text-lg text-gray-800">
          {columns.map((col) => (
            <TableHead key={String(col.name)} className={`${col.width} text-gray-700`}>
              {col.label}
            </TableHead>
          ))}
          <TableHead className="w-[5%]" />
        </TableRow>
      </TableHeaderBase>
      <TableBody>
        {fields.map((row, rowIndex) => {
          return (
            <TableRow
              key={row.id}
              onClick={() => clearRowErrors(rowIndex)}
              className={`${!disabled ? "hover:bg-muted/50" : ""} `}
            >
              {columns.map((col) => {
                const rowValues = watchedFields?.[rowIndex] ?? defaultRow;
                const disabled = col.getDisabled
                  ? (col.disabled ?? false) || col.getDisabled(rowValues as TRow)
                  : (col.disabled ?? false);

                return (
                  <TableCell key={String(col.name)} className="font-medium p-2 align-top">
                    <JevInput
                      fieldName={`${name}.${rowIndex}.${String(col.name)}` as any}
                      className="disabled:bg-transparent"
                      variant="table"
                      type={col.type}
                      register={register}
                      control={control}
                      errors={errors}
                      placeholder={col.placeholder}
                      clearErrors={clearErrors}
                      disabled={disabled}
                      options={col.options ?? undefined}
                    />
                  </TableCell>
                );
              })}
              <TableCell className="w-0 whitespace-nowrap px-0 py-4 align-top">
                {(isOptional || rowIndex !== 0) && (
                  <Button
                    variant="destructive"
                    type="button"
                    disabled={disabled}
                    onClick={() => remove(rowIndex)}
                  >
                    <Trash2 size={20} className="text-red-400" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell className="text-center p-0" colSpan={5}>
            <Button
              className="w-full justify-center text-gray-800 rounded-sm bg-transparent p-6"
              variant="secondary"
              type="button"
              disabled={disabled}
              onClick={() => append(defaultRow)}
            >
              <PlusIcon className="size-6" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
      {footerContent && (
        <TableFooter className={`${footerClass}`}>{footerContent}</TableFooter>
      )}
    </TableBase>
  );
}

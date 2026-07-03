import React from "react";
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
  FieldValues,
  Path,
  FieldPath,
  UseFormReturn,
} from "react-hook-form";
import type { SelectOptions, InputType } from "../field/_types";
import { InputRenderer } from "../field/RHFInputRenderer";

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
  form: UseFormReturn<TForm>;
  append: (value: TRow) => void;
  remove: (index: number) => void;
  defaultRow: Partial<TRow>;
  footerClass?: string;
  footerContent?: React.ReactNode;
  customErrorPaths?: Path<TForm>[];
  isOptional?: boolean;
  disabled?: boolean;
};

/**
 * Editable RHF table for nested field arrays.
 *
 * Assumes `name` is an array property on the parent form
 * (e.g. `accountingEntries`, `supportingDocuments`).
 *
 * Root-level array forms have not been tested and may
 * require changes to field path generation.
 */
export function EditableTable<
  TRow extends FieldValues,
  TForm extends FieldValues,
>({
  columns,
  fields,
  name,
  form,
  append,
  remove,
  defaultRow,
  footerContent,
  footerClass,
  customErrorPaths,
  isOptional,
  disabled,
}: JevTableProps<TRow, TForm>) {
  const { control, clearErrors } = form;

  const watchedFields = useWatch({ control, name });

  const clearRowErrors = (rowIndex: number) => {
    columns.forEach((col) => {
      clearErrors(`${name}.${rowIndex}.${String(col.name)}` as Path<TForm>);
    });
    customErrorPaths?.forEach((path) => clearErrors(path));
  };
  return (
    <TableBase
      className={`table-fixed ${disabled ? "bg-muted/10" : ""} rounded-b-lg`}
    >
      <TableHeaderBase>
        <TableRow className="text-sm">
          {columns.map((col) => (
            <TableHead
              key={String(col.name)}
              className={`${col.width} ${disabled ? "text-muted-foreground/80" : "text-gray-700"}`}
            >
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
              className={`${!disabled ? "hover:bg-muted/50" : ""}`}
            >
              {columns.map((col) => {
                const rowValues = watchedFields?.[rowIndex] ?? defaultRow;
                const cellDisabled = col.getDisabled
                  ? (col.disabled ?? false) ||
                    col.getDisabled(rowValues as TRow)
                  : (col.disabled ?? false);

                return (
                  <TableCell key={String(col.name)} className="p-1 align-top">
                    <InputRenderer<TRow, TForm>
                      field={col}
                      fieldName={
                        `${name}.${rowIndex}.${String(col.name)}` as any
                      }
                      form={form}
                      variant="table"
                      disabled={disabled || cellDisabled}
                    />
                  </TableCell>
                );
              })}
              <TableCell className="w-0 px-0 py-4 align-top whitespace-nowrap">
                {(isOptional || rowIndex > 1) && (
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
          <TableCell className="p-0 text-center" colSpan={columns.length + 1}>
            <Button
              className="w-full justify-center rounded-sm bg-transparent p-6 text-gray-600"
              variant="secondary"
              type="button"
              disabled={disabled}
              onClick={() => append(defaultRow as TRow)}
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

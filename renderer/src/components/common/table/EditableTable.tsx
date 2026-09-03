import React, { memo, useCallback } from "react";
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
import type { InputField } from "../field/_types";
import { InputRenderer } from "../field/RHFInputRenderer";

export type EditableTableColumn<TRow extends FieldValues> = Omit<
  InputField<TRow>,
  "name"
> & {
  name: FieldPath<TRow>;
  label: string;
  width?: string;
  getDisabled?: (row: TRow) => boolean;
};

type EditableTableProps<TRow extends FieldValues, TForm extends FieldValues> = {
  columns: EditableTableColumn<TRow>[];
  fields: (TRow & { id: string })[];
  name: Path<TForm>;
  form: UseFormReturn<TForm>;
  append: (value: TRow) => void;
  remove: (index: number) => void;
  defaultRow: Partial<TRow>;
  footerClass?: string;
  footerContent?: React.ReactNode;
  customErrorPaths?: Path<TForm>[];
  minRows?: number;
  disabled?: boolean;
};

type EditableTableRowProps<
  TRow extends FieldValues,
  TForm extends FieldValues,
> = {
  columns: EditableTableColumn<TRow>[];
  rowIndex: number;
  name: Path<TForm>;
  form: UseFormReturn<TForm>;
  defaultRow: Partial<TRow>;
  disabled?: boolean;
  canRemove: boolean;
  onRemove: (rowIndex: number) => void;
  onClearErrors: (rowIndex: number) => void;
};

function EditableTableRowInner<
  TRow extends FieldValues,
  TForm extends FieldValues,
>({
  columns,
  rowIndex,
  name,
  form,
  defaultRow,
  disabled,
  canRemove,
  onRemove,
  onClearErrors,
}: EditableTableRowProps<TRow, TForm>) {
  const rowValues = useWatch({
    control: form.control,
    name: `${name}.${rowIndex}` as Path<TForm>,
  });

  return (
    <TableRow
      onClick={() => onClearErrors(rowIndex)}
      className={`${!disabled ? "hover:bg-muted/50" : ""}`}
    >
      {columns.map((col) => {
        const values = (rowValues ?? defaultRow) as TRow;
        const cellDisabled = col.getDisabled
          ? (col.disabled ?? false) || col.getDisabled(values)
          : (col.disabled ?? false);

        return (
          <TableCell
            key={String(col.name)}
            className="p-1 align-top"
            onClick={(e) => e.stopPropagation()}
          >
            <InputRenderer<TRow, TForm>
              field={col}
              fieldName={
                `${name}.${rowIndex}.${String(col.name)}` as Path<TForm>
              }
              form={form}
              variant="table"
              disabled={disabled || cellDisabled}
            />
          </TableCell>
        );
      })}
      <TableCell className="w-0 px-0 py-4 align-top whitespace-nowrap">
        {canRemove && (
          <Button
            variant="destructive"
            type="button"
            disabled={disabled}
            onClick={() => onRemove(rowIndex)}
          >
            <Trash2 size={20} className="text-red-400" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

const EditableTableRow = memo(
  EditableTableRowInner,
) as typeof EditableTableRowInner;

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
  minRows = 0,
  disabled,
}: EditableTableProps<TRow, TForm>) {
  const { clearErrors } = form;

  const canRemoveRow = fields.length > minRows;

  const clearRowErrors = useCallback(
    (rowIndex: number) => {
      columns.forEach((col) => {
        clearErrors(`${name}.${rowIndex}.${String(col.name)}` as Path<TForm>);
      });
      customErrorPaths?.forEach((path) => clearErrors(path));
    },
    [columns, name, clearErrors, customErrorPaths],
  );
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
        {fields.map((row, rowIndex) => (
          <EditableTableRow<TRow, TForm>
            key={row.id}
            columns={columns}
            rowIndex={rowIndex}
            name={name}
            form={form}
            defaultRow={defaultRow}
            disabled={disabled}
            canRemove={canRemoveRow}
            onRemove={remove}
            onClearErrors={clearRowErrors}
          />
        ))}
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

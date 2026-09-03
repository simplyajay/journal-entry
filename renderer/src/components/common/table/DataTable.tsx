import {
  Table as TableBase,
  TableHeader as TableHeaderBase,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";

export type DataTableColumn<T> = {
  label: string;
  name: keyof T & string;
  width?: string;
  render?: (row: T) => React.ReactNode;
};

type BaseDataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T, index: number) => string;
  noBorder?: boolean;
  actionEnabled?: boolean;
  actionWidth?: string;
  rowHoverClass?: string;
  stickyHeader?: boolean;
  emptyMessage?: React.ReactNode;
};

type DataTableProps<T> =
  | (BaseDataTableProps<T> & {
      actionEnabled?: true;
      actionWidth?: string;
      actionComponent: (row: T) => React.ReactElement;
    })
  | (BaseDataTableProps<T> & {
      actionEnabled?: false;
      actionWidth?: string;
      actionComponent?: undefined;
    });

const DataTable = <T extends Record<string, unknown>>({
  columns,
  rows,
  getRowId,
  noBorder,
  actionEnabled,
  actionWidth,
  actionComponent,
  rowHoverClass,
  stickyHeader,
  emptyMessage = "No data to show.",
}: DataTableProps<T>) => {
  const columnCount = columns.length + (actionEnabled ? 1 : 0);
  return (
    <div className="relative w-full">
      <TableBase
        className="table-fixed"
        containerClassName={stickyHeader ? "overflow-visible" : undefined}
      >
        <TableHeaderBase>
          <TableRow className="text-sm">
            {columns.map((col) => (
              <TableHead
                key={col.name}
                className={`${stickyHeader ? "sticky top-0 z-10 bg-white" : ""} ${col.width}`}
              >
                {col.label}
              </TableHead>
            ))}
            {actionEnabled && (
              <TableHead
                className={`${stickyHeader ? "sticky top-0 z-10 bg-white" : ""} ${actionWidth ?? "w-[10%]"}`}
              >
                Action
              </TableHead>
            )}
          </TableRow>
        </TableHeaderBase>
        <TableBody>
          {rows.length === 0 && (
            <TableRow noBorder>
              <TableCell
                colSpan={columnCount}
                className="h-32 text-center text-gray-400 italic"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
          {rows.map((row, index) => (
            <TableRow
              className={`${rowHoverClass} group`}
              noBorder={noBorder}
              key={getRowId(row, index)}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.name}
                  className="overflow-hidden pr-6 text-ellipsis whitespace-nowrap"
                >
                  {col.render ? col.render(row) : String(row[col.name] ?? "")}
                </TableCell>
              ))}
              {actionComponent && <TableCell>{actionComponent(row)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </TableBase>
    </div>
  );
};

export default DataTable;

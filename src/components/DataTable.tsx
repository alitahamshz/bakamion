import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
} from '@tanstack/react-table'

type Props<TData extends RowData> = {
  columns: ColumnDef<TData>[]
  data: TData[]
  getRowId?: (originalRow: TData, index: number) => string
  ariaLabel: string
  className?: string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  ariaLabel,
  className,
}: Props<TData>) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getRowId })

  return (
    <div className="records-wrap">
      <table className={className} aria-label={ariaLabel}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

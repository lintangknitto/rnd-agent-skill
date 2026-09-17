import type { ReactNode } from 'react'

export type Column<T> = {
  key: string
  header: string
  sortable?: boolean
  render: (row: T) => ReactNode
}

type DataTableProps<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  sortKey?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (key: string) => void
  testId?: string
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  sortKey,
  sortDir,
  onSort,
  testId = 'data-table',
}: DataTableProps<T>) {
  return (
    <div className="table-wrap" data-testid={testId}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sortKey === col.key
              const label = active ? `${col.header} ${sortDir === 'asc' ? '▲' : '▼'}` : col.header
              return (
                <th
                  key={col.key}
                  className={col.sortable ? 'sortable' : undefined}
                  onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                  aria-sort={
                    active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
                  }
                  data-testid={`sort-${col.key}`}
                >
                  {label}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} data-testid={`row-${rowKey(row)}`}>
              {columns.map((col) => (
                <td key={col.key}>{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

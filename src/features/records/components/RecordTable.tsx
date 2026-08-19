import { Edit3, ImageOff, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { formatDateTime, formatRelativeDate } from '@/lib/date'
import { cn } from '@/lib/utils'
import type { RecordItem } from '../types'

type Props = {
  records: RecordItem[]
  onEdit: (record: RecordItem) => void
  onDelete: (record: RecordItem) => void
}

const statusClass: Record<string, string> = {
  active: 'bg-[#e9f7ef] text-[#18794e]',
  inactive: 'bg-slate-100 text-slate-500',
  pending: 'bg-[#fff7e5] text-[#a15c00]',
}

function Thumbnail({ record }: { record: RecordItem }) {
  const url = record.image.url.trim()
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const showImage = Boolean(url) && failedUrl !== url

  return (
    <div className="grid h-11 w-16 place-items-center overflow-hidden rounded-[5px] bg-slate-100 text-slate-400">
      {showImage ? (
        <img
          src={url}
          alt={record.image.alt}
          className="size-full object-cover"
          onError={() => setFailedUrl(url)}
        />
      ) : (
        <ImageOff size={24} />
      )}
    </div>
  )
}

export function RecordTable({ records, onEdit, onDelete }: Props) {
  const columns = useMemo<ColumnDef<RecordItem>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'شناسه',
        cell: ({ getValue }) => (
          <span className="text-xs text-slate-500">#{getValue<number>()}</span>
        ),
      },
      {
        id: 'image',
        header: 'تصویر',
        cell: ({ row }) => <Thumbnail record={row.original} />,
      },
      {
        accessorKey: 'title',
        header: 'عنوان',
        cell: ({ getValue }) => {
          const title = getValue<string>()
          return (
            <strong title={title} className="block overflow-hidden text-ellipsis whitespace-nowrap">
              {title}
            </strong>
          )
        },
      },
      {
        accessorKey: 'description',
        header: 'توضیحات',
        cell: ({ getValue }) => {
          const description = getValue<string>()
          return (
            <p
              title={description}
              className="block overflow-hidden text-ellipsis whitespace-nowrap text-slate-500"
            >
              {description}
            </p>
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'وضعیت',
        cell: ({ row }) => (
          <span
            className={cn(
              'inline-flex rounded-full px-2 py-1 text-xs',
              statusClass[row.original.status.key] ?? 'bg-slate-100 text-slate-500',
            )}
          >
            {row.original.status.value}
          </span>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'تاریخ ایجاد',
        cell: ({ getValue }) => {
          const createdAt = getValue<string>()
          return (
            <time className="text-xs text-slate-500" title={formatDateTime(createdAt)}>
              {formatRelativeDate(createdAt)}
            </time>
          )
        },
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">عملیات</span>,
        cell: ({ row }) => (
          <div className="row-actions flex gap-0.5">
            <Button
              variant="ghost"
              aria-label={`ویرایش ${row.original.title}`}
              onClick={() => onEdit(row.original)}
            >
              <Edit3 size={17} />
            </Button>
            <Button
              variant="ghost"
              className="text-danger hover:text-white"
              aria-label={`حذف ${row.original.title}`}
              onClick={() => onDelete(row.original)}
            >
              <Trash2 size={17} />
            </Button>
          </div>
        ),
      },
    ],
    [onDelete, onEdit],
  )

  return (
    <DataTable
      ariaLabel="لیست رکوردها"
      className="records-table"
      columns={columns}
      data={records}
      getRowId={(record) => String(record.id)}
    />
  )
}

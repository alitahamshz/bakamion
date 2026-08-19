import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { FilterDefinition } from '../types'

type Props = {
  filters: FilterDefinition[]
  query: string
  status: string
  onQueryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onReset: () => void
}

const fieldClass = 'field grid flex-[0_1_220px] gap-1.5 text-[13px] text-slate-600'

export function RecordFilters({
  filters,
  query,
  status,
  onQueryChange,
  onStatusChange,
  onReset,
}: Props) {
  const statusFilter = filters.find((filter) => filter.key === 'status')
  const searchFilter = filters.find((filter) => filter.key === 'search')
  const hasFilters = Boolean(query || status)

  return (
    <section
      className="filters mb-6 flex items-end gap-3.5 rounded-[10px] border border-slate-200 bg-white p-[18px]"
      aria-label="فیلترهای رکوردها"
    >
      <div className={cn(fieldClass, 'field--search flex-[0_1_350px]')}>
        <Label htmlFor="record-search">{searchFilter?.label ?? 'جستجو'}</Label>
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute top-2.5 right-2.5 text-slate-400"
          />
          <Input
            id="record-search"
            className="pr-[35px]"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="عنوان یا توضیحات..."
          />
        </div>
      </div>
      <div className={fieldClass}>
        <Label htmlFor="record-status">{statusFilter?.label ?? 'وضعیت'}</Label>
        <Select
          dir="rtl"
          value={status || 'all'}
          onValueChange={(value) => onStatusChange(value === 'all' ? '' : value)}
        >
          <SelectTrigger id="record-status" aria-label={statusFilter?.label ?? 'وضعیت'}>
            <SelectValue placeholder="همه وضعیت‌ها" />
          </SelectTrigger>
          <SelectContent dir="rtl">
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            {statusFilter?.options.map((option) => (
              <SelectItem key={option.key} value={option.key}>
                {option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasFilters && (
        <Button variant="ghost" className="clear-button mb-px" onClick={onReset}>
          <X size={16} />
          پاک‌کردن
        </Button>
      )}
    </section>
  )
}

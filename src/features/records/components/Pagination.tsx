import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  page: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function Pagination({ page, totalPages, pageSize, onPageChange, onPageSizeChange }: Props) {
  return (
    <div className="pagination mt-4 flex items-center justify-between text-[13px] text-slate-500">
      <div className="page-size flex items-center gap-2">
        <span>نمایش</span>
        <select
          className="rounded-[5px] border border-slate-300 bg-white p-[5px]"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {[5, 10, 20, -1].map((size) => (
            <option key={size} value={size}>
              {size === -1 ? 'همه' : size}
            </option>
          ))}
        </select>
        <span>رکورد</span>
      </div>
      <div className="page-actions flex items-center gap-2">
        <span>
          صفحه {page} از {totalPages}
        </span>
        <Button
          variant="outline"
          aria-label="صفحه قبل"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronRight size={17} />
        </Button>
        <Button
          variant="outline"
          aria-label="صفحه بعد"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronLeft size={17} />
        </Button>
      </div>
    </div>
  )
}

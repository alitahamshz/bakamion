import { AlertTriangle } from 'lucide-react'
import { AppDialog } from '@/components/AppDialog'
import { Button } from '@/components/ui/button'
import type { RecordItem } from '../types'

type Props = {
  record: RecordItem
  onClose: () => void
  onConfirm: () => void
}

export function DeleteDialog({ record, onClose, onConfirm }: Props) {
  return (
    <AppDialog
      title="حذف رکورد"
      description={<>از حذف «{record.title}» مطمئن هستید؟</>}
      icon={<AlertTriangle className="text-amber-700" size={28} />}
      className="grid gap-2.5"
      onClose={onClose}
    >
      <footer className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          حذف رکورد
        </Button>
      </footer>
    </AppDialog>
  )
}

import { X } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

type Props = {
  title: string
  description: ReactNode
  children: ReactNode
  onClose: () => void
  icon?: ReactNode
  className?: string
}

export function AppDialog({ title, description, children, onClose, icon, className }: Props) {
  const descriptionId = useId()

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={className} dir="rtl" aria-describedby={descriptionId}>
        {icon}
        <header className="mb-[22px] flex items-center justify-between gap-3">
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription id={descriptionId} className="mt-1.5 text-sm text-slate-500">
              {description}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" aria-label="بستن">
              <X size={20} />
            </Button>
          </DialogClose>
        </header>
        {children}
      </DialogContent>
    </Dialog>
  )
}

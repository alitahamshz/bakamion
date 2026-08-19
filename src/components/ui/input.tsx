import { forwardRef, type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const controlClassName =
  'w-full rounded-md border border-slate-300 bg-white px-2.5 py-[9px] text-slate-800 outline-none transition-colors focus:border-brand focus:ring-3 focus:ring-brand-ring'

export const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(controlClassName, className)} {...props} />
  ),
)

Input.displayName = 'Input'

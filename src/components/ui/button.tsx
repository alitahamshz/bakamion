import { cva, type VariantProps } from 'class-variance-authority'
import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'button inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-[7px] border border-transparent px-3.5 text-sm transition-colors duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-45',
  {
    variants: {
      variant: {
        default: 'bg-brand text-white hover:bg-brand-hover hover:text-white',
        outline:
          'border-slate-300 bg-white text-slate-700 hover:border-brand-hover hover:bg-brand-hover hover:text-white',
        ghost:
          'bg-transparent px-2 text-slate-600 hover:border-brand-hover hover:bg-brand-hover hover:text-white',
        destructive: 'bg-danger text-white hover:bg-[#9b1c14] hover:text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />
}

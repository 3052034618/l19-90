import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-[#00E5C7] text-[#0F1923] hover:bg-[#00C9AF] shadow-[0_0_20px_rgba(0,229,199,0.3)]': variant === 'primary',
          'border border-[#2A3A4A] text-[#8B9DAF] hover:bg-[#1A2A3A] hover:text-white': variant === 'secondary',
          'text-[#8B9DAF] hover:text-white hover:bg-[#1A2A3A]': variant === 'ghost',
          'bg-[#FF4757] text-white hover:bg-[#E0404F] shadow-[0_0_20px_rgba(255,71,87,0.3)]': variant === 'danger',
        },
        {
          'px-3 py-1.5 text-xs': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

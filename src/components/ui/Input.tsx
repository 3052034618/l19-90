import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-[#8B9DAF]">{label}</label>}
      <input
        className={cn(
          'w-full rounded-lg border border-[#2A3A4A] bg-[#0D1520] px-3 py-2 text-sm text-white placeholder-[#4A5A6A] outline-none transition-all duration-200',
          'focus:border-[#00E5C7] focus:shadow-[0_0_0_3px_rgba(0,229,199,0.15)]',
          className
        )}
        {...props}
      />
    </div>
  )
}

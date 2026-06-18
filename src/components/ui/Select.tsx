import { cn } from '@/lib/utils'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export default function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-[#8B9DAF]">{label}</label>}
      <select
        className={cn(
          'w-full rounded-lg border border-[#2A3A4A] bg-[#0D1520] px-3 py-2 text-sm text-white outline-none transition-all duration-200 appearance-none',
          'focus:border-[#00E5C7] focus:shadow-[0_0_0_3px_rgba(0,229,199,0.15)]',
          '[&>option]:bg-[#0D1520] [&>option]:text-white',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

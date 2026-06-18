import { cn } from '@/lib/utils'

type BadgeVariant = 'cyan' | 'red' | 'orange' | 'blue' | 'yellow' | 'green' | 'gray'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  pulse?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  cyan: 'bg-[#00E5C7]/15 text-[#00E5C7] border-[#00E5C7]/30',
  red: 'bg-[#FF4757]/15 text-[#FF4757] border-[#FF4757]/30',
  orange: 'bg-[#FFA502]/15 text-[#FFA502] border-[#FFA502]/30',
  blue: 'bg-[#3498DB]/15 text-[#3498DB] border-[#3498DB]/30',
  yellow: 'bg-[#F1C40F]/15 text-[#F1C40F] border-[#F1C40F]/30',
  green: 'bg-[#2ECC71]/15 text-[#2ECC71] border-[#2ECC71]/30',
  gray: 'bg-[#8B9DAF]/15 text-[#8B9DAF] border-[#8B9DAF]/30',
}

export default function Badge({ variant = 'gray', children, className, pulse = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        pulse && 'animate-pulse',
        className
      )}
    >
      {pulse && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

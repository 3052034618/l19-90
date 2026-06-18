import { cn } from '@/lib/utils'
import type { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function Card({ children, className, hover = false, glow = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#1E2D3D] bg-[#111B27] p-4 transition-all duration-300',
        hover && 'hover:border-[#2A3A4A] hover:bg-[#152030] cursor-pointer',
        glow && 'shadow-[0_0_30px_rgba(0,229,199,0.08)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

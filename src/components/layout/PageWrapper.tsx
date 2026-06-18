import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
  title: string
  subtitle?: string
  headerRight?: ReactNode
}

export default function PageWrapper({ children, title, subtitle, headerRight }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#0F1923] pl-[72px]"
    >
      <header className="border-b border-[#1E2D3D] bg-[#0F1923]/80 backdrop-blur-md sticky top-0 z-20 px-8 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-[#8B9DAF] truncate">{subtitle}</p>}
        </div>
        {headerRight && <div className="shrink-0">{headerRight}</div>}
      </header>
      <main className="p-8">{children}</main>
    </motion.div>
  )
}

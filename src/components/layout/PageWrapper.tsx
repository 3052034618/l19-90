import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export default function PageWrapper({ children, title, subtitle }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#0F1923] pl-[72px]"
    >
      <header className="border-b border-[#1E2D3D] bg-[#0F1923]/80 backdrop-blur-md sticky top-0 z-20 px-8 py-4">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-[#8B9DAF]">{subtitle}</p>}
      </header>
      <main className="p-8">{children}</main>
    </motion.div>
  )
}

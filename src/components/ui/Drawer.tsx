import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  width?: string
}

export default function Drawer({ open, onClose, title, children, width = 'w-[420px]' }: DrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed right-0 top-0 z-50 h-full ${width} overflow-y-auto border-l border-[#1E2D3D] bg-[#0F1923] p-6`}
          >
            {title && (
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-[#8B9DAF] transition-colors hover:bg-[#1A2A3A] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

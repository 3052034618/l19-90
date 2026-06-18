import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useClueStore } from '@/store/clueStore'

export default function RelatedHint() {
  const { clues, currentClueId } = useClueStore()
  const [visible, setVisible] = useState(false)
  const [related, setRelated] = useState<string[]>([])

  useEffect(() => {
    if (!currentClueId) return
    const current = clues.find((c) => c.id === currentClueId)
    if (!current) return
    const relatedKeywords = clues
      .filter((c) => c.id !== currentClueId)
      .filter((c) => c.keywords.some((kw) => current.keywords.includes(kw)))
      .map((c) => c.keywords[0])
    setRelated(relatedKeywords)
    setVisible(relatedKeywords.length > 0)
  }, [currentClueId, clues])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-[88px] right-8 z-30 mx-auto max-w-xl"
        >
          <div className="flex items-center gap-3 rounded-xl border border-[#FFA502]/30 bg-[#1A1A0F]/90 px-4 py-3 backdrop-blur-md">
            <AlertTriangle size={18} className="shrink-0 text-[#FFA502]" />
            <p className="flex-1 text-sm text-[#FFA502]">
              发现关联线索：{related.join('、')}，可能存在事件关联
            </p>
            <button onClick={() => setVisible(false)} className="text-[#4A5A6A] hover:text-white">
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

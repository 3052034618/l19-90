import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useBriefingStore } from '@/store/briefingStore'
import Badge from '@/components/ui/Badge'
import type { RiskLevel } from '@/types'

const riskBadge: Record<RiskLevel, { variant: 'red' | 'orange' | 'yellow' | 'blue'; label: string }> = {
  red: { variant: 'red', label: '红色 · 重大' },
  orange: { variant: 'orange', label: '橙色 · 较大' },
  yellow: { variant: 'yellow', label: '黄色 · 一般' },
  blue: { variant: 'blue', label: '蓝色 · 轻微' },
}

export default function BriefingPreview() {
  const { briefing } = useBriefingStore()
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!briefing) return
    const fullText = briefing.originJudgment + '\n\n' + briefing.spreadPath
    setDisplayedText('')
    setIsTyping(true)
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, 20)
    return () => clearInterval(timer)
  }, [briefing?.id])

  if (!briefing) {
    return (
      <div className="flex h-64 items-center justify-center text-[#4A5A6A]">
        请选择上报节点后生成简报
      </div>
    )
  }

  const rb = riskBadge[briefing.riskLevel]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl bg-white p-8 shadow-xl text-[#1A1A1A]"
    >
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold">舆情值班摘要</h2>
        <Badge variant={rb.variant}>{rb.label}</Badge>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="mb-1 text-sm font-bold text-gray-500">起源判断</h3>
          <p className="text-sm leading-relaxed">{displayedText.split('\n\n')[0] || ''}</p>
        </div>

        <div>
          <h3 className="mb-1 text-sm font-bold text-gray-500">扩散路径</h3>
          <p className="text-sm leading-relaxed">{displayedText.split('\n\n')[1] || ''}</p>
        </div>

        <div>
          <h3 className="mb-1 text-sm font-bold text-gray-500">建议关注对象</h3>
          <div className="flex flex-wrap gap-2">
            {briefing.suggestedTargets.map((target) => (
              <span
                key={target}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {target}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3 text-xs text-gray-400">
          生成时间：{new Date(briefing.generatedAt).toLocaleString('zh-CN')}
          {isTyping && <span className="ml-2 animate-pulse text-[#00E5C7]">正在生成…</span>}
        </div>
      </div>
    </motion.div>
  )
}

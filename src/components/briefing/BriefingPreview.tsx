import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useBriefingStore } from '@/store/briefingStore'
import Badge from '@/components/ui/Badge'
import type { RiskLevel } from '@/types'
import { Edit3, Check, X } from 'lucide-react'

const riskBadge: Record<RiskLevel, { variant: 'red' | 'orange' | 'yellow' | 'blue'; label: string }> = {
  red: { variant: 'red', label: '红色 · 重大' },
  orange: { variant: 'orange', label: '橙色 · 较大' },
  yellow: { variant: 'yellow', label: '黄色 · 一般' },
  blue: { variant: 'blue', label: '蓝色 · 轻微' },
}

type EditableField = 'originJudgment' | 'spreadPath' | 'publicResponse' | 'internalConcerns' | 'verificationList'

export default function BriefingPreview() {
  const { briefing, updateOriginJudgment, updateSpreadPath, updatePublicResponse, updateInternalConcerns, updateVerificationList } = useBriefingStore()
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [editingField, setEditingField] = useState<EditableField | null>(null)
  const [editValue, setEditValue] = useState('')

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

  const startEdit = (field: EditableField, value: string) => {
    setEditingField(field)
    setEditValue(value)
  }

  const saveEdit = () => {
    if (!editingField) return
    if (editingField === 'originJudgment') updateOriginJudgment(editValue)
    if (editingField === 'spreadPath') updateSpreadPath(editValue)
    if (editingField === 'publicResponse') updatePublicResponse(editValue)
    if (editingField === 'internalConcerns') updateInternalConcerns(editValue)
    if (editingField === 'verificationList') updateVerificationList(editValue)
    setEditingField(null)
  }

  const cancelEdit = () => {
    setEditingField(null)
    setEditValue('')
  }

  const EditableSection = ({
    title,
    field,
    value,
    isTextarea = false,
  }: {
    title: string
    field: EditableField
    value: string
    isTextarea?: boolean
  }) => {
    const isEditing = editingField === field
    return (
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-500">{title}</h3>
          {!isEditing ? (
            <button
              onClick={() => startEdit(field, value)}
              className="text-xs text-[#00E5C7] hover:text-[#00E5C7]/80 flex items-center gap-1"
            >
              <Edit3 size={12} /> 编辑
            </button>
          ) : (
            <div className="flex gap-1">
              <button onClick={saveEdit} className="p-1 text-green-500 hover:bg-green-50 rounded"><Check size={14} /></button>
              <button onClick={cancelEdit} className="p-1 text-red-500 hover:bg-red-50 rounded"><X size={14} /></button>
            </div>
          )}
        </div>
        {isEditing ? (
          isTextarea ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              className="w-full min-h-[80px] p-2 border border-gray-300 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-[#00E5C7] focus:border-[#00E5C7] outline-none"
            />
          ) : (
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              className="w-full p-2 border border-gray-300 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-[#00E5C7] focus:border-[#00E5C7] outline-none"
            />
          )
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl bg-white p-8 shadow-xl text-[#1A1A1A] space-y-6"
    >
      <div className="mb-2 flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold">舆情值班摘要</h2>
        <Badge variant={rb.variant}>{rb.label}</Badge>
      </div>

      <div className="space-y-5">
        <EditableSection title="起源判断" field="originJudgment" value={editingField === 'originJudgment' ? editValue : (displayedText.split('\n\n')[0] || briefing.originJudgment)} isTextarea />
        <EditableSection title="扩散路径" field="spreadPath" value={editingField === 'spreadPath' ? editValue : (displayedText.split('\n\n')[1] || briefing.spreadPath)} isTextarea />

        <div className="border-t border-gray-200 pt-4">
          <h3 className="mb-3 text-sm font-bold text-gray-700 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00E5C7]"></span>
            值班话术
          </h3>
          <div className="space-y-4">
            <EditableSection title="对外回应口径" field="publicResponse" value={briefing.publicResponse} isTextarea />
            <EditableSection title="内部关注点" field="internalConcerns" value={briefing.internalConcerns} isTextarea />
            <EditableSection title="下一步核查清单" field="verificationList" value={briefing.verificationList} isTextarea />
          </div>
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

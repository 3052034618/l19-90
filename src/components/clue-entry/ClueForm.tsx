import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, Upload, MapPin, Link2, Tag } from 'lucide-react'
import { useClueStore } from '@/store/clueStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { Priority } from '@/types'

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'urgent', label: '紧急', color: 'bg-[#FF4757]/20 text-[#FF4757] border-[#FF4757]/40' },
  { value: 'high', label: '高', color: 'bg-[#FFA502]/20 text-[#FFA502] border-[#FFA502]/40' },
  { value: 'medium', label: '中', color: 'bg-[#F1C40F]/20 text-[#F1C40F] border-[#F1C40F]/40' },
  { value: 'low', label: '低', color: 'bg-[#3498DB]/20 text-[#3498DB] border-[#3498DB]/40' },
]

export default function ClueForm() {
  const navigate = useNavigate()
  const { addClue, setCurrentClue } = useClueStore()
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [location, setLocation] = useState('')
  const [links, setLinks] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const addKeyword = () => {
    const trimmed = keywordInput.trim()
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed])
      setKeywordInput('')
    }
  }

  const removeKeyword = (kw: string) => setKeywords(keywords.filter((k) => k !== kw))

  const handleSubmit = () => {
    if (keywords.length === 0) return
    addClue({
      keywords,
      location,
      links: links.split('\n').filter((l) => l.trim()),
      screenshots: [],
      priority,
    })
    const newestClue = useClueStore.getState().clues[0]
    if (newestClue) setCurrentClue(newestClue.id)
    navigate('/propagation')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-[#8B9DAF]">
          <Tag size={14} /> 关键词 <span className="text-[#FF4757]">*</span>
        </label>
        <div className="flex gap-2">
          <input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            placeholder="输入关键词后回车添加"
            className="flex-1 rounded-lg border border-[#2A3A4A] bg-[#0D1520] px-3 py-2 text-sm text-white placeholder-[#4A5A6A] outline-none transition-all focus:border-[#00E5C7] focus:shadow-[0_0_0_3px_rgba(0,229,199,0.15)]"
          />
          <Button size="sm" variant="secondary" onClick={addKeyword}>
            <Plus size={14} />
          </Button>
        </div>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {keywords.map((kw) => (
              <Badge key={kw} variant="cyan">
                {kw}
                <button onClick={() => removeKeyword(kw)} className="ml-1 hover:text-white">
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Input
        label="疑似事件地点"
        placeholder="例如：江苏省南京市江宁区"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-[#8B9DAF]">
          <Link2 size={14} /> 首批链接
        </label>
        <textarea
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          placeholder="每行粘贴一条链接"
          rows={3}
          className="w-full rounded-lg border border-[#2A3A4A] bg-[#0D1520] px-3 py-2 text-sm text-white placeholder-[#4A5A6A] outline-none transition-all focus:border-[#00E5C7] focus:shadow-[0_0_0_3px_rgba(0,229,199,0.15)] resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#8B9DAF]">截图上传</label>
        <div className="flex h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-[#2A3A4A] bg-[#0D1520] transition-colors hover:border-[#00E5C7]/50">
          <div className="flex flex-col items-center gap-1 text-[#4A5A6A]">
            <Upload size={20} />
            <span className="text-xs">点击或拖拽上传截图</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#8B9DAF]">线索优先级</label>
        <div className="flex gap-2">
          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => setPriority(p.value)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs font-medium transition-all',
                priority === p.value ? p.color : 'border-[#2A3A4A] text-[#4A5A6A] hover:border-[#3A4A5A]'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={handleSubmit} disabled={keywords.length === 0}>
        提交线索并开始溯源
      </Button>
    </div>
  )
}

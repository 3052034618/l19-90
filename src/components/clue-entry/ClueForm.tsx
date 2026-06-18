import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, Upload, MapPin, Link2, Tag, Image, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useClueStore } from '@/store/clueStore'
import { usePropagationStore } from '@/store/propagationStore'
import { useBriefingStore } from '@/store/briefingStore'
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
  const { addNodesForClue, getNodesByClueId } = usePropagationStore()
  const { setSelectedNodeIds, resetBriefing } = useBriefingStore()
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [location, setLocation] = useState('')
  const [links, setLinks] = useState('')
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [priority, setPriority] = useState<Priority>('medium')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addKeyword = () => {
    const trimmed = keywordInput.trim()
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed])
      setKeywordInput('')
    }
  }

  const removeKeyword = (kw: string) => setKeywords(keywords.filter((k) => k !== kw))

  const handleFiles = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList)
    const imageFiles = files.filter((f) => f.type.startsWith('image/'))
    const readers = imageFiles.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })
    )
    Promise.all(readers).then((dataUrls) => {
      setScreenshots((prev) => [...prev, ...dataUrls])
    })
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const removeScreenshot = (idx: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== idx))
  }

  const handleSubmit = () => {
    if (keywords.length === 0) return
    addClue({
      keywords,
      location,
      links: links.split('\n').filter((l) => l.trim()),
      screenshots,
      priority,
    })
    const newestClue = useClueStore.getState().clues[0]
    if (newestClue) {
      addNodesForClue(newestClue)
      setCurrentClue(newestClue.id)
      const nodeIds = getNodesByClueId(newestClue.id).map((n) => n.id)
      setSelectedNodeIds(nodeIds)
      resetBriefing()
    }
    setKeywords([])
    setLocation('')
    setLinks('')
    setScreenshots([])
    setPriority('medium')
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
        <label className="flex items-center gap-1.5 text-xs font-medium text-[#8B9DAF]">
          <Image size={14} /> 截图上传
          {screenshots.length > 0 && <span className="text-[#00E5C7]">（已上传 {screenshots.length} 张）</span>}
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            'flex min-h-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed bg-[#0D1520] transition-all',
            dragOver
              ? 'border-[#00E5C7] bg-[#00E5C7]/5'
              : 'border-[#2A3A4A] hover:border-[#00E5C7]/50'
          )}
        >
          {screenshots.length === 0 ? (
            <div className="flex flex-col items-center gap-1 text-[#4A5A6A] py-6">
              <Upload size={20} />
              <span className="text-xs">点击选择或拖拽图片到此处</span>
              <span className="text-[10px]">支持 JPG、PNG、GIF 等格式</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 p-3 w-full">
              <AnimatePresence>
                {screenshots.map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative h-16 w-16 rounded-md overflow-hidden border border-[#2A3A4A] group"
                  >
                    <img src={src} alt={`screenshot-${i}`} className="h-full w-full object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeScreenshot(i)
                      }}
                      className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center"
                    >
                      <Trash2 size={10} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="h-16 w-16 rounded-md border-2 border-dashed border-[#2A3A4A] text-[#4A5A6A] flex items-center justify-center hover:border-[#00E5C7]/50 hover:text-[#00E5C7] transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          )}
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

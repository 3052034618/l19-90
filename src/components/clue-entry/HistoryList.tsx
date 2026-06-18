import { Clock, MapPin, Image } from 'lucide-react'
import { useClueStore } from '@/store/clueStore'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { Priority, ClueStatus } from '@/types'

const priorityBadge: Record<Priority, { variant: 'red' | 'orange' | 'yellow' | 'blue'; label: string }> = {
  urgent: { variant: 'red', label: '紧急' },
  high: { variant: 'orange', label: '高' },
  medium: { variant: 'yellow', label: '中' },
  low: { variant: 'blue', label: '低' },
}

const statusBadge: Record<ClueStatus, { variant: 'cyan' | 'orange' | 'green' | 'gray'; label: string }> = {
  draft: { variant: 'gray', label: '草稿' },
  analyzing: { variant: 'orange', label: '分析中' },
  analyzed: { variant: 'cyan', label: '已分析' },
  briefed: { variant: 'green', label: '已出报' },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return `${Math.floor(diff / 60000)}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

export default function HistoryList() {
  const { clues, currentClueId, setCurrentClue } = useClueStore()

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[#8B9DAF]">最近线索</h3>
      <div className="space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto pr-1 custom-scrollbar">
        {clues.map((clue) => {
          const pBadge = priorityBadge[clue.priority]
          const sBadge = statusBadge[clue.status]
          return (
            <Card
              key={clue.id}
              hover
              className={cn(
                'cursor-pointer transition-all',
                currentClueId === clue.id && 'border-[#00E5C7]/40 bg-[#0D1520]'
              )}
              onClick={() => setCurrentClue(clue.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-white line-clamp-1">
                  {clue.keywords.join('、')}
                </span>
                <Badge variant={pBadge.variant} className="shrink-0">
                  {pBadge.label}
                </Badge>
              </div>
              {clue.location && (
                <div className="mt-1.5 flex items-center gap-1 text-xs text-[#4A5A6A]">
                  <MapPin size={10} />
                  {clue.location}
                </div>
              )}
              <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant={sBadge.variant}>{sBadge.label}</Badge>
                  {clue.screenshots.length > 0 && (
                    <span className="inline-flex items-center gap-0.5 rounded-full border border-[#3498DB]/30 bg-[#3498DB]/15 px-2 py-0.5 text-[10px] font-medium text-[#3498DB]">
                      <Image size={10} />
                      {clue.screenshots.length}
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1 text-[10px] text-[#4A5A6A]">
                  <Clock size={10} />
                  {timeAgo(clue.createdAt)}
                </span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

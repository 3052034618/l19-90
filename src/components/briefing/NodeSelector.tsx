import { usePropagationStore } from '@/store/propagationStore'
import { useClueStore } from '@/store/clueStore'
import { useBriefingStore } from '@/store/briefingStore'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Check, X, CheckSquare, Square } from 'lucide-react'
import type { NodeType, AuthorType } from '@/types'

const nodeTypeLabel: Record<NodeType, string> = {
  earliest: '最早可见',
  amplifier: '大号扩散',
  sentiment_turn: '情绪转折',
  normal: '普通',
}

const nodeTypeBadge: Record<NodeType, 'blue' | 'orange' | 'red' | 'gray'> = {
  earliest: 'blue',
  amplifier: 'orange',
  sentiment_turn: 'red',
  normal: 'gray',
}

const authorLabel: Record<AuthorType, string> = {
  personal: '个人',
  media: '媒体',
  government: '政务',
  influencer: '大V',
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export default function NodeSelector() {
  const { getNodesByClueId } = usePropagationStore()
  const { currentClueId } = useClueStore()
  const { selectedNodeIds, toggleNode } = useBriefingStore()

  if (!currentClueId) return null

  const nodes = getNodesByClueId(currentClueId).sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  )

  const allSelected = nodes.every((n) => selectedNodeIds.includes(n.id))
  const selectAll = () => nodes.forEach((n) => { if (!selectedNodeIds.includes(n.id)) toggleNode(n.id) })
  const deselectAll = () => nodes.forEach((n) => { if (selectedNodeIds.includes(n.id)) toggleNode(n.id) })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#8B9DAF]">选择上报节点</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={allSelected ? deselectAll : selectAll}>
            {allSelected ? <><X size={12} />取消全选</> : <><Check size={12} />全选</>}
          </Button>
        </div>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {nodes.map((node) => {
          const isSelected = selectedNodeIds.includes(node.id)
          return (
            <div
              key={node.id}
              onClick={() => toggleNode(node.id)}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                isSelected
                  ? 'border-[#00E5C7]/40 bg-[#0D1520]'
                  : 'border-[#1E2D3D] bg-[#111B27] hover:border-[#2A3A4A]'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isSelected ? (
                  <CheckSquare size={16} className="text-[#00E5C7]" />
                ) : (
                  <Square size={16} className="text-[#4A5A6A]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{node.authorName}</span>
                  <Badge variant={nodeTypeBadge[node.nodeType]}>{nodeTypeLabel[node.nodeType]}</Badge>
                </div>
                <p className="mt-1 text-xs text-[#4A5A6A] line-clamp-1">{node.content}</p>
                <div className="mt-1 text-[10px] text-[#4A5A6A]">
                  {authorLabel[node.authorType]} · {node.platform} · {formatTime(node.publishedAt)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

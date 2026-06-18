import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { usePropagationStore } from '@/store/propagationStore'
import Badge from '@/components/ui/Badge'
import type { PropagationNode, NodeType, AuthorType, Sentiment } from '@/types'

const nodeColors: Record<NodeType, string> = {
  earliest: '#3498DB',
  amplifier: '#FFA502',
  sentiment_turn: '#FF4757',
  normal: '#4A5A6A',
}

const authorBadge: Record<AuthorType, { variant: 'gray' | 'cyan' | 'orange' | 'blue'; label: string }> = {
  personal: { variant: 'gray', label: '个人' },
  media: { variant: 'cyan', label: '媒体' },
  government: { variant: 'blue', label: '政务' },
  influencer: { variant: 'orange', label: '大V' },
}

const nodeTypeLabel: Record<NodeType, string> = {
  earliest: '最早可见信息',
  amplifier: '首次大号扩散',
  sentiment_turn: '情绪转折点',
  normal: '普通节点',
}

const sentimentLabel: Record<Sentiment, string> = {
  positive: '正面',
  neutral: '中性',
  negative: '负面',
  mixed: '混合',
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

function formatNum(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export default function TimelineNode({ node, index }: { node: PropagationNode; index: number }) {
  const { openDetail, selectedNodeId } = usePropagationStore()
  const color = nodeColors[node.nodeType]
  const isSelected = selectedNodeId === node.id

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={() => openDetail(node.id)}
      className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
        isSelected
          ? 'border-[#00E5C7]/40 bg-[#152030] shadow-[0_0_20px_rgba(0,229,199,0.1)]'
          : 'border-[#1E2D3D] bg-[#111B27] hover:border-[#2A3A4A] hover:bg-[#152030]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative mt-1 shrink-0">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}60` }}
          />
          {node.nodeType === 'sentiment_turn' && (
            <div
              className="absolute inset-0 h-3 w-3 animate-ping rounded-full opacity-40"
              style={{ backgroundColor: color }}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">{node.authorName}</span>
            <Badge variant={authorBadge[node.authorType].variant}>
              {authorBadge[node.authorType].label}
            </Badge>
            {node.nodeType !== 'normal' && (
              <Badge variant={node.nodeType === 'earliest' ? 'blue' : node.nodeType === 'amplifier' ? 'orange' : 'red'} pulse={node.nodeType === 'sentiment_turn'}>
                {nodeTypeLabel[node.nodeType]}
              </Badge>
            )}
            <span className="ml-auto shrink-0 text-xs text-[#4A5A6A]">{formatTime(node.publishedAt)}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[#8B9DAF] line-clamp-2">{node.content}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-[#4A5A6A]">
            <span className="flex items-center gap-1"><Heart size={12} />{formatNum(node.likes)}</span>
            <span className="flex items-center gap-1"><MessageCircle size={12} />{formatNum(node.comments)}</span>
            <span className="flex items-center gap-1"><Share2 size={12} />{formatNum(node.shares)}</span>
            <span className="ml-auto text-[10px]">{node.platform}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

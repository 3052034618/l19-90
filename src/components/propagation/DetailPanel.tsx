import { Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react'
import { usePropagationStore } from '@/store/propagationStore'
import Drawer from '@/components/ui/Drawer'
import Badge from '@/components/ui/Badge'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { AuthorType, NodeType, Sentiment } from '@/types'

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

const sentimentVariant: Record<Sentiment, 'green' | 'gray' | 'red' | 'yellow'> = {
  positive: 'green',
  neutral: 'gray',
  negative: 'red',
  mixed: 'yellow',
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

export default function DetailPanel() {
  const { isDetailOpen, closeDetail, selectedNodeId, getNodeById, getNodesByClueId } = usePropagationStore()

  const node = selectedNodeId ? getNodeById(selectedNodeId) : undefined
  if (!node) return null

  const chartData = node.interactionHistory.map((p) => ({
    time: formatTime(p.time),
    likes: p.likes,
    comments: p.comments,
    shares: p.shares,
  }))

  const allNodes = getNodesByClueId(node.clueId)
  const adjacentNodes = allNodes.filter((n) => node.adjacentSources.includes(n.id))

  return (
    <Drawer open={isDetailOpen} onClose={closeDetail} title="节点详情" width="w-[440px]">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant={authorBadge[node.authorType].variant}>{authorBadge[node.authorType].label}</Badge>
          <Badge variant={node.nodeType === 'earliest' ? 'blue' : node.nodeType === 'amplifier' ? 'orange' : node.nodeType === 'sentiment_turn' ? 'red' : 'gray'}>
            {nodeTypeLabel[node.nodeType]}
          </Badge>
          <Badge variant={sentimentVariant[node.sentiment]}>{sentimentLabel[node.sentiment]}</Badge>
        </div>

        <div>
          <h4 className="text-xs font-medium text-[#4A5A6A] mb-2">原文摘要</h4>
          <p className="text-sm leading-relaxed text-[#C8D6E5]">{node.content}</p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-white font-medium">{node.authorName}</span>
          <span className="text-[#4A5A6A]">·</span>
          <span className="text-[#4A5A6A]">{node.platform}</span>
          <span className="text-[#4A5A6A]">·</span>
          <span className="text-[#4A5A6A]">{formatTime(node.publishedAt)}</span>
        </div>

        <div className="flex gap-6 text-sm">
          <span className="flex items-center gap-1 text-[#FF6B7A]"><Heart size={14} />{node.likes.toLocaleString()}</span>
          <span className="flex items-center gap-1 text-[#00E5C7]"><MessageCircle size={14} />{node.comments.toLocaleString()}</span>
          <span className="flex items-center gap-1 text-[#FFA502]"><Share2 size={14} />{node.shares.toLocaleString()}</span>
        </div>

        <div>
          <h4 className="text-xs font-medium text-[#4A5A6A] mb-3">互动量趋势</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#4A5A6A' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#4A5A6A' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{ background: '#1A2A3A', border: '1px solid #2A3A4A', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#8B9DAF' }}
                />
                <Line type="monotone" dataKey="likes" stroke="#FF6B7A" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="comments" stroke="#00E5C7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="shares" stroke="#FFA502" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {node.originalLink && (
          <div>
            <h4 className="text-xs font-medium text-[#4A5A6A] mb-2">原始来源（首批链接）</h4>
            <div className="rounded-lg border border-[#1E2D3D] bg-[#0D1520] px-3 py-2 text-sm">
              <div className="flex items-center gap-2 mb-1">
                <ExternalLink size={12} className="text-[#3498DB]" />
                <span className="text-[#3498DB] font-medium">{node.originalLink.platform}</span>
                <span className="text-[#4A5A6A] text-xs">· {node.originalLink.domain}</span>
              </div>
              <a
                href={node.originalLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#8B9DAF] hover:text-[#00E5C7] transition-colors break-all"
              >
                {node.originalLink.url}
              </a>
            </div>
          </div>
        )}

        {adjacentNodes.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-[#4A5A6A] mb-2">相邻传播来源</h4>
            <div className="space-y-2">
              {adjacentNodes.map((adj) => (
                <div
                  key={adj.id}
                  className="flex items-center gap-2 rounded-lg border border-[#1E2D3D] bg-[#0D1520] px-3 py-2 text-sm cursor-pointer hover:border-[#00E5C7]/40 transition-colors"
                  onClick={() => {
                    usePropagationStore.getState().selectNode(adj.id)
                  }}
                >
                  <ExternalLink size={12} className="text-[#4A5A6A]" />
                  <span className="text-[#8B9DAF]">{adj.authorName}</span>
                  <span className="ml-auto text-xs text-[#4A5A6A]">{adj.platform}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  )
}

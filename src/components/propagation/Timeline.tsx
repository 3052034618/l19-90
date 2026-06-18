import { usePropagationStore } from '@/store/propagationStore'
import { useClueStore } from '@/store/clueStore'
import TimelineNode from './TimelineNode'

export default function Timeline() {
  const { getNodesByClueId } = usePropagationStore()
  const { currentClueId } = useClueStore()

  if (!currentClueId) {
    return (
      <div className="flex h-64 items-center justify-center text-[#4A5A6A]">
        请先选择或创建线索
      </div>
    )
  }

  const nodes = getNodesByClueId(currentClueId).sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  )

  if (nodes.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-[#4A5A6A]">
        暂无传播节点数据
      </div>
    )
  }

  return (
    <div className="relative space-y-0">
      {nodes.map((node, index) => (
        <div key={node.id} className="relative">
          {index > 0 && (
            <div className="absolute left-[5px] -top-3 h-3 w-[2px] bg-gradient-to-b from-[#2A3A4A] to-[#2A3A4A]" />
          )}
          <div className="pl-5 pb-4">
            <TimelineNode node={node} index={index} />
          </div>
          {index < nodes.length - 1 && (
            <div className="absolute left-[5px] top-[calc(100%-16px)] h-4 w-[2px] bg-[#2A3A4A]" />
          )}
        </div>
      ))}
    </div>
  )
}

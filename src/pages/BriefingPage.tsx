import PageWrapper from '@/components/layout/PageWrapper'
import NodeSelector from '@/components/briefing/NodeSelector'
import BriefingPreview from '@/components/briefing/BriefingPreview'
import ExportBar from '@/components/briefing/ExportBar'
import Button from '@/components/ui/Button'
import { useBriefingStore } from '@/store/briefingStore'
import { useClueStore } from '@/store/clueStore'
import { usePropagationStore } from '@/store/propagationStore'
import { Sparkles } from 'lucide-react'

export default function BriefingPage() {
  const { generateBriefing, briefing } = useBriefingStore()
  const { currentClueId } = useClueStore()
  const { getNodesByClueId } = usePropagationStore()

  const handleGenerate = () => {
    if (!currentClueId) return
    const nodes = getNodesByClueId(currentClueId).map((n) => ({
      id: n.id,
      nodeType: n.nodeType,
      authorName: n.authorName,
      sentiment: n.sentiment,
      publishedAt: n.publishedAt,
    }))
    generateBriefing(currentClueId, nodes)
  }

  return (
    <PageWrapper title="处置简报" subtitle="勾选上报节点，自动生成值班摘要">
      <div className="flex gap-8 pb-20">
        <div className="w-96 shrink-0">
          <NodeSelector />
          <div className="mt-4">
            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={!currentClueId}
            >
              <Sparkles size={16} />
              {briefing ? '重新生成简报' : '生成简报'}
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <BriefingPreview />
        </div>
      </div>
      <ExportBar />
    </PageWrapper>
  )
}

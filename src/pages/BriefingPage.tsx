import { useEffect } from 'react'
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
  const { generateBriefing, selectedNodeIds, briefing } = useBriefingStore()
  const { currentClueId } = useClueStore()
  const { getNodesByClueId } = usePropagationStore()

  const nodes = currentClueId ? getNodesByClueId(currentClueId) : []

  useEffect(() => {
    if (!currentClueId) return
    if (selectedNodeIds.length === 0) return
    if (briefing && briefing.selectedNodeIds.length === selectedNodeIds.length &&
        briefing.selectedNodeIds.every((id) => selectedNodeIds.includes(id))) return
    generateBriefing(currentClueId, nodes)
  }, [selectedNodeIds, currentClueId, nodes, briefing, generateBriefing])

  const handleGenerate = () => {
    if (!currentClueId) return
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
              disabled={!currentClueId || selectedNodeIds.length === 0}
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

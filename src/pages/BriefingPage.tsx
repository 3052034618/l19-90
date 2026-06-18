import { useEffect } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import NodeSelector from '@/components/briefing/NodeSelector'
import BriefingPreview from '@/components/briefing/BriefingPreview'
import ExportBar from '@/components/briefing/ExportBar'
import Button from '@/components/ui/Button'
import { useBriefingStore } from '@/store/briefingStore'
import { useClueStore } from '@/store/clueStore'
import { usePropagationStore } from '@/store/propagationStore'
import { Sparkles, Image } from 'lucide-react'

export default function BriefingPage() {
  const { generateBriefing, selectedNodeIds, briefing } = useBriefingStore()
  const { currentClueId, getClueById, openPreview } = useClueStore()
  const { getNodesByClueId } = usePropagationStore()
  const currentClue = currentClueId ? getClueById(currentClueId) : undefined

  const nodes = currentClueId ? getNodesByClueId(currentClueId) : []

  useEffect(() => {
    if (!currentClueId) return
    if (selectedNodeIds.length === 0) {
      if (briefing !== null) {
        useBriefingStore.getState().resetBriefing()
      }
      return
    }
    if (briefing && briefing.selectedNodeIds.length === selectedNodeIds.length &&
        briefing.selectedNodeIds.every((id) => selectedNodeIds.includes(id))) return
    generateBriefing(currentClueId, nodes)
  }, [selectedNodeIds, currentClueId, nodes, briefing, generateBriefing])

  const handleGenerate = () => {
    if (!currentClueId) return
    generateBriefing(currentClueId, nodes)
  }

  const headerRight = currentClue && currentClue.screenshots.length > 0 ? (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#3498DB]/30 bg-[#3498DB]/10 text-[#3498DB] cursor-pointer hover:bg-[#3498DB]/20 transition-colors"
      onClick={() => currentClueId && openPreview(currentClueId)}
    >
      <Image size={14} />
      <span className="text-xs font-medium">已附 {currentClue.screenshots.length} 张截图</span>
    </div>
  ) : undefined

  return (
    <PageWrapper
      title="处置简报"
      subtitle="勾选上报节点，自动生成值班摘要"
      headerRight={headerRight}
    >
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

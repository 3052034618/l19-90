import PageWrapper from '@/components/layout/PageWrapper'
import Timeline from '@/components/propagation/Timeline'
import DetailPanel from '@/components/propagation/DetailPanel'
import SentimentChart from '@/components/propagation/SentimentChart'
import SourceChart from '@/components/propagation/SourceChart'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { FileText, Image } from 'lucide-react'
import { useClueStore } from '@/store/clueStore'

export default function PropagationPage() {
  const navigate = useNavigate()
  const { currentClueId, getClueById, openPreview } = useClueStore()
  const currentClue = currentClueId ? getClueById(currentClueId) : undefined

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
      title="传播链分析"
      subtitle="按时间轴查看传播节点、关键标注与情绪变化"
      headerRight={headerRight}
    >
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <Timeline />
        </div>
        <div className="w-80 shrink-0 space-y-4">
          <SentimentChart />
          <SourceChart />
          <Button
            className="w-full"
            onClick={() => navigate('/briefing')}
          >
            <FileText size={16} />
            生成处置简报
          </Button>
        </div>
      </div>
      <DetailPanel />
    </PageWrapper>
  )
}

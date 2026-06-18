import PageWrapper from '@/components/layout/PageWrapper'
import Timeline from '@/components/propagation/Timeline'
import DetailPanel from '@/components/propagation/DetailPanel'
import SentimentChart from '@/components/propagation/SentimentChart'
import SourceChart from '@/components/propagation/SourceChart'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'

export default function PropagationPage() {
  const navigate = useNavigate()

  return (
    <PageWrapper title="传播链分析" subtitle="按时间轴查看传播节点、关键标注与情绪变化">
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

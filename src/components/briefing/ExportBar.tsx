import { useState } from 'react'
import { Download, Copy, Check, FileText } from 'lucide-react'
import { useBriefingStore } from '@/store/briefingStore'
import Button from '@/components/ui/Button'

export default function ExportBar() {
  const { briefing } = useBriefingStore()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!briefing) return
    const text = [
      '【舆情值班摘要】',
      '',
      '一、起源判断',
      briefing.originJudgment,
      '',
      '二、扩散路径',
      briefing.spreadPath,
      '',
      `三、风险等级：${briefing.riskLevel === 'red' ? '红色·重大' : briefing.riskLevel === 'orange' ? '橙色·较大' : briefing.riskLevel === 'yellow' ? '黄色·一般' : '蓝色·轻微'}`,
      '',
      '四、建议关注对象',
      briefing.suggestedTargets.join('、'),
      '',
      `生成时间：${new Date(briefing.generatedAt).toLocaleString('zh-CN')}`,
    ].join('\n')

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="fixed bottom-0 left-[72px] right-0 z-20 border-t border-[#1E2D3D] bg-[#0F1923]/95 backdrop-blur-md px-8 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[#8B9DAF]">
          <FileText size={14} />
          {briefing ? `已选 ${briefing.selectedNodeIds.length} 个节点` : '未生成简报'}
        </div>
        <div className="flex gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopy}
            disabled={!briefing}
          >
            {copied ? <><Check size={14} />已复制</> : <><Copy size={14} />复制文本</>}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleExportPDF}
            disabled={!briefing}
          >
            <><Download size={14} />导出简报</>
          </Button>
        </div>
      </div>
    </div>
  )
}

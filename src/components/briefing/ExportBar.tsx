import { useState, useMemo } from 'react'
import { Download, Copy, Check, FileText, AlertTriangle } from 'lucide-react'
import { useBriefingStore } from '@/store/briefingStore'
import { usePropagationStore } from '@/store/propagationStore'
import Button from '@/components/ui/Button'

export default function ExportBar() {
  const { briefing, selectedNodeIds } = useBriefingStore()
  const { getNodeById } = usePropagationStore()
  const [copied, setCopied] = useState(false)

  const briefingOutdated = useMemo(() => {
    if (!briefing) return false
    if (briefing.selectedNodeIds.length !== selectedNodeIds.length) return true
    return !briefing.selectedNodeIds.every((id) => selectedNodeIds.includes(id))
  }, [briefing, selectedNodeIds])

  const handleCopy = async () => {
    if (!briefing) return
    const selectedNodes = selectedNodeIds.map((id) => getNodeById(id)).filter(Boolean)
    const nodesText = selectedNodes.length > 0
      ? [
          '',
          '五、上报节点明细',
          ...selectedNodes.map((n, idx) => {
            if (!n) return ''
            const typeLabel = n.nodeType === 'earliest' ? '最早可见' :
              n.nodeType === 'amplifier' ? '大号扩散' :
              n.nodeType === 'sentiment_turn' ? '情绪转折' : '普通节点'
            const time = new Date(n.publishedAt).toLocaleString('zh-CN')
            return `${idx + 1}. [${typeLabel}] ${n.authorName} · ${n.platform} · ${time}\n   ${n.content}`
          }).filter(Boolean),
        ].join('\n')
      : ''

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
      '五、对外回应口径',
      briefing.publicResponse,
      '',
      '六、内部关注点',
      briefing.internalConcerns,
      '',
      '七、下一步核查清单',
      briefing.verificationList,
      nodesText,
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
        <div className="flex items-center gap-3 text-sm text-[#8B9DAF]">
          <div className="flex items-center gap-2">
            <FileText size={14} />
            <span>
              已选 <span className="text-[#00E5C7] font-semibold">{selectedNodeIds.length}</span> 个节点
            </span>
          </div>
          {briefingOutdated && briefing && (
            <div className="flex items-center gap-1 text-[#FFA502] text-xs">
              <AlertTriangle size={12} />
              勾选已变化，简报已自动刷新
            </div>
          )}
          {!briefing && selectedNodeIds.length === 0 && (
            <span className="text-xs text-[#4A5A6A]">请先勾选需要上报的节点</span>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopy}
            disabled={!briefing || selectedNodeIds.length === 0}
          >
            {copied ? <><Check size={14} />已复制</> : <><Copy size={14} />复制文本</>}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleExportPDF}
            disabled={!briefing || selectedNodeIds.length === 0}
          >
            <><Download size={14} />导出简报</>
          </Button>
        </div>
      </div>
    </div>
  )
}

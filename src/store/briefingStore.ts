import { create } from 'zustand'
import type { Briefing, RiskLevel } from '@/types'
import { mockBriefing } from '@/data/mockData'

interface BriefingStore {
  briefing: Briefing | null
  selectedNodeIds: string[]
  generateBriefing: (clueId: string, nodes: { id: string; nodeType: string; authorName: string; sentiment: string; publishedAt: string }[]) => void
  toggleNode: (nodeId: string) => void
  setRiskLevel: (level: RiskLevel) => void
  updateOriginJudgment: (text: string) => void
  updateSpreadPath: (text: string) => void
}

export const useBriefingStore = create<BriefingStore>((set, get) => ({
  briefing: mockBriefing,
  selectedNodeIds: mockBriefing.selectedNodeIds,
  generateBriefing: (clueId, nodes) => {
    const earliestNode = nodes.find((n) => n.nodeType === 'earliest')
    const amplifierNodes = nodes.filter((n) => n.nodeType === 'amplifier')
    const sentimentNodes = nodes.filter((n) => n.nodeType === 'sentiment_turn')
    const negativeCount = nodes.filter((n) => n.sentiment === 'negative').length
    const negativeRatio = negativeCount / Math.max(nodes.length, 1)

    let riskLevel: RiskLevel = 'blue'
    if (sentimentNodes.length >= 2 || negativeRatio > 0.6) riskLevel = 'red'
    else if (sentimentNodes.length >= 1 || negativeRatio > 0.4) riskLevel = 'orange'
    else if (negativeRatio > 0.2) riskLevel = 'yellow'

    const sortedNodes = [...nodes].sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())

    const originJudgment = earliestNode
      ? `最早可见信息来源于${sortedNodes[0]?.authorName || '未知'}于${new Date(sortedNodes[0]?.publishedAt).toLocaleString('zh-CN')}发布的信息，${amplifierNodes.length > 0 ? `随后被${amplifierNodes.map((n) => n.authorName).join('、')}等账号大规模转发扩散。` : '尚未形成大规模扩散。'}`
      : '暂未识别到明确的信息起源节点。'

    const spreadPath = sortedNodes.map((n) => n.authorName).join(' → ')

    const suggestedTargets = amplifierNodes.map((n) => n.authorName)

    const briefing: Briefing = {
      id: `briefing-${Date.now()}`,
      clueId,
      originJudgment,
      spreadPath,
      riskLevel,
      suggestedTargets,
      generatedAt: new Date().toISOString(),
      selectedNodeIds: get().selectedNodeIds,
    }
    set({ briefing })
  },
  toggleNode: (nodeId) =>
    set((state) => ({
      selectedNodeIds: state.selectedNodeIds.includes(nodeId)
        ? state.selectedNodeIds.filter((id) => id !== nodeId)
        : [...state.selectedNodeIds, nodeId],
    })),
  setRiskLevel: (level) =>
    set((state) => ({
      briefing: state.briefing ? { ...state.briefing, riskLevel: level } : null,
    })),
  updateOriginJudgment: (text) =>
    set((state) => ({
      briefing: state.briefing ? { ...state.briefing, originJudgment: text } : null,
    })),
  updateSpreadPath: (text) =>
    set((state) => ({
      briefing: state.briefing ? { ...state.briefing, spreadPath: text } : null,
    })),
}))

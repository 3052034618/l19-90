import { create } from 'zustand'
import type { Briefing, RiskLevel, PropagationNode } from '@/types'
import { mockBriefing } from '@/data/mockData'

interface BriefingStore {
  briefing: Briefing | null
  selectedNodeIds: string[]
  generateBriefing: (clueId: string, allNodes: PropagationNode[]) => void
  toggleNode: (nodeId: string) => void
  setSelectedNodeIds: (ids: string[]) => void
  resetBriefing: () => void
  setRiskLevel: (level: RiskLevel) => void
  updateOriginJudgment: (text: string) => void
  updateSpreadPath: (text: string) => void
  updatePublicResponse: (text: string) => void
  updateInternalConcerns: (text: string) => void
  updateVerificationList: (text: string) => void
}

export const useBriefingStore = create<BriefingStore>((set, get) => ({
  briefing: mockBriefing,
  selectedNodeIds: mockBriefing.selectedNodeIds,

  generateBriefing: (clueId, allNodes) => {
    const selectedIds = get().selectedNodeIds
    const selectedNodes = allNodes.filter((n) => selectedIds.includes(n.id))

    if (selectedNodes.length === 0) {
      set({ briefing: null })
      return
    }

    const earliestNode = selectedNodes.find((n) => n.nodeType === 'earliest')
    const amplifierNodes = selectedNodes.filter((n) => n.nodeType === 'amplifier')
    const sentimentNodes = selectedNodes.filter((n) => n.nodeType === 'sentiment_turn')
    const negativeCount = selectedNodes.filter((n) => n.sentiment === 'negative').length
    const negativeRatio = negativeCount / Math.max(selectedNodes.length, 1)

    let riskLevel: RiskLevel = 'blue'
    if (sentimentNodes.length >= 2 || negativeRatio > 0.6) riskLevel = 'red'
    else if (sentimentNodes.length >= 1 || negativeRatio > 0.4) riskLevel = 'orange'
    else if (negativeRatio > 0.2) riskLevel = 'yellow'

    const sortedNodes = [...selectedNodes].sort(
      (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    )

    const originJudgment = earliestNode
      ? `最早可见信息来源于${sortedNodes[0]?.authorName || '未知'}于${new Date(sortedNodes[0]?.publishedAt).toLocaleString('zh-CN')}发布的信息，${amplifierNodes.length > 0 ? `随后被${amplifierNodes.map((n) => n.authorName).join('、')}等账号大规模转发扩散。` : '尚未形成大规模扩散。'}`
      : '暂未识别到明确的信息起源节点。'

    const spreadPath = sortedNodes.map((n) => `${n.authorName}(${n.platform})`).join(' → ')

    const suggestedTargets = amplifierNodes.map((n) => n.authorName)
    sentimentNodes.forEach((n) => {
      if (!suggestedTargets.includes(n.authorName)) suggestedTargets.push(n.authorName)
    })

    const briefing: Briefing = {
      id: `briefing-${Date.now()}`,
      clueId,
      originJudgment,
      spreadPath,
      riskLevel,
      suggestedTargets,
      generatedAt: new Date().toISOString(),
      selectedNodeIds: [...selectedIds],
      publicResponse: `【情况通报】关于${sortedNodes[0]?.content.slice(0, 20)}…一事，经初步核实，相关部门已第一时间介入处置。有关处置进展我们会第一时间通过官方渠道发布，请以官方发布信息为准。感谢社会各界的关心和监督。`,
      internalConcerns: `1. 信息披露时效性与实际处置节奏的匹配度；2. 事件核心事实的多源核实与交叉验证；3. 评论区集中质疑点的梳理与回应准备（共${selectedNodes.length}条关键节点，其中负面${negativeCount}条）；4. 后续次生舆情风险评估与应对预案。`,
      verificationList: `1. 核查涉事主体近一年的相关备案与检查记录；2. 调取事件发生前后两小时内的关键监控录像；3. 走访事件周边${Math.min(5, selectedNodes.length)}名信息发布者，核实信息来源；4. 联系首发信息发布者，确认第一手资料；5. 核实相关监测数据的完整性与准确性。`,
    }
    set({ briefing })
  },

  toggleNode: (nodeId) =>
    set((state) => ({
      selectedNodeIds: state.selectedNodeIds.includes(nodeId)
        ? state.selectedNodeIds.filter((id) => id !== nodeId)
        : [...state.selectedNodeIds, nodeId],
    })),

  setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),

  resetBriefing: () => set({ briefing: null }),

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

  updatePublicResponse: (text) =>
    set((state) => ({
      briefing: state.briefing ? { ...state.briefing, publicResponse: text } : null,
    })),

  updateInternalConcerns: (text) =>
    set((state) => ({
      briefing: state.briefing ? { ...state.briefing, internalConcerns: text } : null,
    })),

  updateVerificationList: (text) =>
    set((state) => ({
      briefing: state.briefing ? { ...state.briefing, verificationList: text } : null,
    })),
}))

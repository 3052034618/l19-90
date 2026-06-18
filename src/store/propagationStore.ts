import { create } from 'zustand'
import type { PropagationNode, InteractionPoint, Clue } from '@/types'
import { mockPropagationNodes } from '@/data/mockData'
import { parseLink } from '@/utils/helpers'

function makeInteractions(baseLikes: number, baseComments: number, baseShares: number, baseTime: string): InteractionPoint[] {
  const base = new Date(baseTime).getTime()
  return [
    { time: new Date(base - 3600000).toISOString(), likes: Math.round(baseLikes * 0.1), comments: Math.round(baseComments * 0.05), shares: Math.round(baseShares * 0.08) },
    { time: new Date(base - 2700000).toISOString(), likes: Math.round(baseLikes * 0.3), comments: Math.round(baseComments * 0.2), shares: Math.round(baseShares * 0.25) },
    { time: new Date(base - 1800000).toISOString(), likes: Math.round(baseLikes * 0.6), comments: Math.round(baseComments * 0.5), shares: Math.round(baseShares * 0.55) },
    { time: new Date(base - 900000).toISOString(), likes: Math.round(baseLikes * 0.85), comments: Math.round(baseComments * 0.8), shares: Math.round(baseShares * 0.8) },
    { time: baseTime, likes: baseLikes, comments: baseComments, shares: baseShares },
    { time: new Date(base + 900000).toISOString(), likes: Math.round(baseLikes * 1.1), comments: Math.round(baseComments * 1.15), shares: Math.round(baseShares * 1.1) },
  ]
}

const templates = {
  earliest: [
    (kw: string, loc: string) => `【${loc}突发】${kw}，现场有居民反映情况异常，已联系相关部门。`,
    (kw: string, loc: string) => `${loc}的朋友注意了，${kw}，有在附近的吗？来说说具体情况。`,
    (kw: string, loc: string) => `刚收到消息，${loc}发生${kw}，大家密切关注。`,
  ],
  amplifier: [
    (kw: string, loc: string) => `【${kw}】${loc}事件引发广泛关注，目前相关部门已介入调查。我们将持续跟进报道。`,
    (kw: string, loc: string) => `突发：${loc}${kw}，目前情况如何？记者正在核实更多细节。`,
  ],
  sentiment_turn: [
    (kw: string, loc: string) => `官方通报说"情况已控制"，但${loc}的朋友反馈仍未恢复正常，希望能有更透明的信息披露。`,
    (kw: string, loc: string) => `对于此次${kw}事件，我想提出几个疑问：为什么反应这么慢？信息披露为什么不及时？`,
  ],
  normal: [
    (kw: string, loc: string) => `我家就在${loc}附近，目前一切正常，请大家不要传播未经证实的消息。`,
    (kw: string, loc: string) => `${kw}？关注一下后续进展。`,
    (kw: string, loc: string) => `有亲戚在${loc}，电话联系上了，人没事，大家放心。`,
    (kw: string, loc: string) => `最新消息：${loc}相关部门已召开新闻发布会通报${kw}处理情况。`,
    (kw: string, loc: string) => `路过${loc}，目前现场秩序平稳，${kw}相关工作正在有序进行。`,
  ],
  positive: [
    (kw: string, loc: string) => `${loc}应急处置效率还是很高的，为一线工作人员点赞！`,
    (kw: string, loc: string) => `大家不传谣不信谣，相信专业部门能处理好${kw}。`,
  ],
  government: [
    (kw: string, loc: string) => `${loc}官方通报：关于${kw}的情况说明如下，目前各项处置工作正在有序开展，请以官方发布信息为准。`,
  ],
}

const authors = {
  earliest: [
    { name: '本地热心网友', type: 'personal' as const },
    { name: '现场目击者小王', type: 'personal' as const },
    { name: '知情人透露', type: 'personal' as const },
  ],
  amplifier: [
    { name: '都市快报', type: 'media' as const },
    { name: '新闻晨报', type: 'media' as const },
    { name: '一线记者老张', type: 'influencer' as const },
  ],
  sentiment_turn: [
    { name: '时评人李先生', type: 'influencer' as const },
    { name: '深度观察', type: 'influencer' as const },
  ],
  normal: [
    { name: '隔壁邻居', type: 'personal' as const },
    { name: '吃瓜群众', type: 'personal' as const },
    { name: '关心一下', type: 'personal' as const },
    { name: '新闻跟踪', type: 'media' as const },
    { name: '社区发言人', type: 'government' as const },
  ],
  government: [
    { name: '本地发布', type: 'government' as const },
    { name: '平安通报', type: 'government' as const },
  ],
}

const platforms = ['微博', '微信', '头条', '抖音', '小红书', '知乎']

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]
}

export function generateNodesForClue(clue: Clue): PropagationNode[] {
  const kw = clue.keywords[0] || '突发事件'
  const loc = clue.location || '事发地区'
  const nodes: PropagationNode[] = []
  const baseTime = new Date(clue.createdAt).getTime()
  let cursor = baseTime

  const originalLinks = (clue.links || [])
    .map((url) => parseLink(url))
    .filter(Boolean) as NonNullable<ReturnType<typeof parseLink>>[]

  const push = (
    nodeType: PropagationNode['nodeType'],
    authorList: { name: string; type: PropagationNode['authorType'] }[],
    templateList: ((kw: string, loc: string) => string)[],
    likes: number,
    comments: number,
    shares: number,
    sentiment: PropagationNode['sentiment'],
    adjIdx: number[] = [],
    offset: number,
    preferOriginalLink = false
  ) => {
    cursor = cursor + offset
    const a = pick(authorList, nodes.length)
    const tpl = pick(templateList, nodes.length)
    let platform = pick(platforms, nodes.length)
    const id = `${clue.id}-node-${nodes.length + 1}`

    let originalLink = undefined
    if (preferOriginalLink && originalLinks.length > 0) {
      const idx = nodeType === 'earliest' ? 0 : 1
      originalLink = originalLinks[idx % originalLinks.length]
      if (originalLink) {
        platform = originalLink.platform
        originalLink = { ...originalLink, matchedNodeId: id }
      }
    } else if (originalLinks.length > nodes.length && !preferOriginalLink) {
      originalLink = { ...originalLinks[nodes.length % originalLinks.length], matchedNodeId: id }
      platform = originalLink.platform
    }

    nodes.push({
      id,
      clueId: clue.id,
      content: tpl(kw, loc),
      authorName: a.name,
      authorType: a.type,
      platform,
      publishedAt: new Date(cursor).toISOString(),
      likes,
      comments,
      shares,
      nodeType,
      sentiment,
      adjacentSources: adjIdx.map((i) => nodes[i]?.id || '').filter(Boolean),
      interactionHistory: makeInteractions(likes, comments, shares, new Date(cursor).toISOString()),
      originalLink,
    })
  }

  push('earliest', authors.earliest, templates.earliest, 200, 80, 120, 'neutral', [], 60000, true)
  push('amplifier', authors.amplifier, templates.amplifier, 5800, 3200, 8500, 'negative', [0], 900000, true)
  push('normal', authors.normal, templates.normal, 1200, 680, 540, 'negative', [1], 1800000)
  push('normal', authors.government, templates.government, 11000, 7800, 14000, 'neutral', [1, 2], 1200000)
  push('sentiment_turn', authors.sentiment_turn, templates.sentiment_turn, 24000, 16500, 9200, 'negative', [3], 1500000)
  push('normal', authors.normal, templates.normal, 9800, 5400, 6800, 'negative', [4], 900000)
  push('normal', authors.normal, templates.positive, 3600, 2100, 1300, 'positive', [3], 600000)
  push('normal', authors.government, templates.government, 7200, 3600, 4700, 'neutral', [6], 600000)

  return nodes
}

interface PropagationStore {
  nodes: PropagationNode[]
  selectedNodeId: string | null
  isDetailOpen: boolean
  setNodes: (nodes: PropagationNode[]) => void
  selectNode: (id: string | null) => void
  openDetail: (id: string) => void
  closeDetail: () => void
  getNodesByClueId: (clueId: string) => PropagationNode[]
  getNodeById: (id: string) => PropagationNode | undefined
  addNodesForClue: (clue: Clue) => void
}

export const usePropagationStore = create<PropagationStore>((set, get) => ({
  nodes: mockPropagationNodes,
  selectedNodeId: null,
  isDetailOpen: false,
  setNodes: (nodes) => set({ nodes }),
  selectNode: (id) => set({ selectedNodeId: id }),
  openDetail: (id) => set({ selectedNodeId: id, isDetailOpen: true }),
  closeDetail: () => set({ isDetailOpen: false, selectedNodeId: null }),
  getNodesByClueId: (clueId) => get().nodes.filter((n) => n.clueId === clueId),
  getNodeById: (id) => get().nodes.find((n) => n.id === id),
  addNodesForClue: (clue) => {
    const generated = generateNodesForClue(clue)
    set((state) => ({ nodes: [...generated, ...state.nodes] }))
  },
}))

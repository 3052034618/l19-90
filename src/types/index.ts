export type Priority = 'urgent' | 'high' | 'medium' | 'low'
export type NodeType = 'earliest' | 'amplifier' | 'sentiment_turn' | 'normal'
export type AuthorType = 'personal' | 'media' | 'government' | 'influencer'
export type RiskLevel = 'red' | 'orange' | 'yellow' | 'blue'
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'mixed'
export type ClueStatus = 'draft' | 'analyzing' | 'analyzed' | 'briefed'

export interface Clue {
  id: string
  keywords: string[]
  location: string
  links: string[]
  screenshots: string[]
  priority: Priority
  status: ClueStatus
  createdAt: string
  updatedAt: string
}

export interface InteractionPoint {
  time: string
  likes: number
  comments: number
  shares: number
}

export interface OriginalLink {
  url: string
  domain: string
  platform: string
  matchedNodeId?: string
}

export interface PropagationNode {
  id: string
  clueId: string
  content: string
  authorName: string
  authorType: AuthorType
  platform: string
  publishedAt: string
  likes: number
  comments: number
  shares: number
  nodeType: NodeType
  sentiment: Sentiment
  adjacentSources: string[]
  interactionHistory: InteractionPoint[]
  originalLink?: OriginalLink
}

export interface Briefing {
  id: string
  clueId: string
  originJudgment: string
  spreadPath: string
  riskLevel: RiskLevel
  suggestedTargets: string[]
  generatedAt: string
  selectedNodeIds: string[]
  publicResponse: string
  internalConcerns: string
  verificationList: string
}

import { create } from 'zustand'
import type { PropagationNode } from '@/types'
import { mockPropagationNodes } from '@/data/mockData'

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
}))

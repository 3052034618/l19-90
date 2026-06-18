import { create } from 'zustand'
import type { Clue, Priority, ClueStatus } from '@/types'
import { mockClues } from '@/data/mockData'

interface ClueStore {
  clues: Clue[]
  currentClueId: string | null
  previewClueId: string | null
  isPreviewOpen: boolean
  addClue: (clue: Omit<Clue, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void
  setCurrentClue: (id: string) => void
  updateClueStatus: (id: string, status: ClueStatus) => void
  getClueById: (id: string) => Clue | undefined
  openPreview: (id: string) => void
  closePreview: () => void
}

export const useClueStore = create<ClueStore>((set, get) => ({
  clues: mockClues,
  currentClueId: 'clue-001',
  previewClueId: null,
  isPreviewOpen: false,
  addClue: (clueData) => {
    const newClue: Clue = {
      ...clueData,
      id: `clue-${Date.now()}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({ clues: [newClue, ...state.clues] }))
  },
  setCurrentClue: (id) => set({ currentClueId: id }),
  updateClueStatus: (id, status) =>
    set((state) => ({
      clues: state.clues.map((c) =>
        c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
      ),
    })),
  getClueById: (id) => get().clues.find((c) => c.id === id),
  openPreview: (id) => set({ previewClueId: id, isPreviewOpen: true }),
  closePreview: () => set({ isPreviewOpen: false, previewClueId: null }),
}))

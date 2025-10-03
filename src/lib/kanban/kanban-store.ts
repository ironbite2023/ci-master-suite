/**
 * Kanban Board State Management
 * Uses Zustand for local state management
 */

import { create } from 'zustand'

export interface KanbanCard {
  id: string
  columnId: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  assignedTo?: string
  createdAt: string
  movedAt: string
  tags: string[]
}

export interface KanbanColumn {
  id: string
  name: string
  wipLimit: number
  position: number
  color: string
}

export interface CardHistory {
  cardId: string
  fromColumn: string
  toColumn: string
  movedAt: string
}

interface KanbanStore {
  // State
  columns: KanbanColumn[]
  cards: KanbanCard[]
  history: CardHistory[]
  
  // Column actions
  addColumn: (column: Omit<KanbanColumn, 'id'>) => void
  updateColumn: (id: string, updates: Partial<KanbanColumn>) => void
  deleteColumn: (id: string) => void
  reorderColumns: (columnIds: string[]) => void
  
  // Card actions
  addCard: (card: Omit<KanbanCard, 'id' | 'createdAt' | 'movedAt'>) => void
  updateCard: (id: string, updates: Partial<KanbanCard>) => void
  deleteCard: (id: string) => void
  moveCard: (cardId: string, toColumnId: string) => void
  
  // Analytics
  getColumnCards: (columnId: string) => KanbanCard[]
  getCardHistory: (cardId: string) => CardHistory[]
  calculateCycleTime: (cardId: string) => number
  calculateLeadTime: (cardId: string) => number
  
  // Utility
  reset: () => void
}

const initialColumns: KanbanColumn[] = [
  { id: '1', name: 'Backlog', wipLimit: 0, position: 0, color: '#gray' },
  { id: '2', name: 'To Do', wipLimit: 5, position: 1, color: '#blue' },
  { id: '3', name: 'In Progress', wipLimit: 3, position: 2, color: '#yellow' },
  { id: '4', name: 'Review', wipLimit: 2, position: 3, color: '#purple' },
  { id: '5', name: 'Done', wipLimit: 0, position: 4, color: '#green' }
]

const initialCards: KanbanCard[] = [
  {
    id: '1',
    columnId: '2',
    title: 'Implement new feature',
    description: 'Add user authentication',
    priority: 'high',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'John Doe',
    createdAt: new Date().toISOString(),
    movedAt: new Date().toISOString(),
    tags: ['feature', 'backend']
  },
  {
    id: '2',
    columnId: '2',
    title: 'Fix login bug',
    description: 'Users cannot login with email',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    movedAt: new Date().toISOString(),
    tags: ['bug', 'critical']
  },
  {
    id: '3',
    columnId: '3',
    title: 'Update documentation',
    description: 'Document new API endpoints',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    movedAt: new Date().toISOString(),
    tags: ['documentation']
  },
  {
    id: '4',
    columnId: '4',
    title: 'Code review: Dashboard',
    description: 'Review dashboard component refactor',
    priority: 'medium',
    assignedTo: 'Jane Smith',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    movedAt: new Date().toISOString(),
    tags: ['review']
  }
]

export const useKanbanStore = create<KanbanStore>((set, get) => ({
  columns: initialColumns,
  cards: initialCards,
  history: [],
  
  addColumn: (column) => {
    const newColumn: KanbanColumn = {
      ...column,
      id: Date.now().toString()
    }
    set((state) => ({
      columns: [...state.columns, newColumn].sort((a, b) => a.position - b.position)
    }))
  },
  
  updateColumn: (id, updates) => {
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === id ? { ...col, ...updates } : col
      )
    }))
  },
  
  deleteColumn: (id) => {
    set((state) => ({
      columns: state.columns.filter((col) => col.id !== id),
      cards: state.cards.filter((card) => card.columnId !== id)
    }))
  },
  
  reorderColumns: (columnIds) => {
    set((state) => ({
      columns: columnIds
        .map((id, index) => {
          const col = state.columns.find((c) => c.id === id)
          return col ? { ...col, position: index } : null
        })
        .filter((col): col is KanbanColumn => col !== null)
    }))
  },
  
  addCard: (card) => {
    const newCard: KanbanCard = {
      ...card,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      movedAt: new Date().toISOString()
    }
    set((state) => ({
      cards: [...state.cards, newCard]
    }))
  },
  
  updateCard: (id, updates) => {
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, ...updates } : card
      )
    }))
  },
  
  deleteCard: (id) => {
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id)
    }))
  },
  
  moveCard: (cardId, toColumnId) => {
    const card = get().cards.find((c) => c.id === cardId)
    if (!card) return
    
    const historyEntry: CardHistory = {
      cardId,
      fromColumn: card.columnId,
      toColumn: toColumnId,
      movedAt: new Date().toISOString()
    }
    
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === cardId
          ? { ...c, columnId: toColumnId, movedAt: new Date().toISOString() }
          : c
      ),
      history: [...state.history, historyEntry]
    }))
  },
  
  getColumnCards: (columnId) => {
    return get().cards.filter((card) => card.columnId === columnId)
  },
  
  getCardHistory: (cardId) => {
    return get().history.filter((h) => h.cardId === cardId)
  },
  
  calculateCycleTime: (cardId) => {
    const card = get().cards.find((c) => c.id === cardId)
    const history = get().getCardHistory(cardId)
    
    if (!card || history.length === 0) return 0
    
    // Find when card entered "In Progress" and when it moved to "Done"
    const startedIndex = history.findIndex((h) => h.toColumn === '3') // In Progress
    const completedIndex = history.findIndex((h) => h.toColumn === '5') // Done
    
    if (startedIndex === -1 || completedIndex === -1) return 0
    
    const startTime = new Date(history[startedIndex].movedAt).getTime()
    const endTime = new Date(history[completedIndex].movedAt).getTime()
    
    return (endTime - startTime) / (1000 * 60 * 60 * 24) // days
  },
  
  calculateLeadTime: (cardId) => {
    const card = get().cards.find((c) => c.id === cardId)
    if (!card || card.columnId !== '5') return 0 // Only for done cards
    
    const createdTime = new Date(card.createdAt).getTime()
    const completedTime = new Date(card.movedAt).getTime()
    
    return (completedTime - createdTime) / (1000 * 60 * 60 * 24) // days
  },
  
  reset: () => {
    set({
      columns: initialColumns,
      cards: initialCards,
      history: []
    })
  }
}))

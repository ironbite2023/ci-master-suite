'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Clock, User, AlertCircle, ArrowLeft } from 'lucide-react'
import { useKanbanStore } from '@/lib/kanban/kanban-store'
import { toast } from 'sonner'

export default function KanbanPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/dashboard/lean');
  };

  const { columns, addCard, moveCard, getColumnCards } = useKanbanStore()
  
  const [draggedCard, setDraggedCard] = useState<string | null>(null)
  const [newCardDialog, setNewCardDialog] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<string>('')
  
  const [newCard, setNewCard] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignedTo: '',
    dueDate: '',
    tags: [] as string[]
  })

  const handleDragStart = (cardId: string) => {
    setDraggedCard(cardId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (columnId: string) => {
    if (draggedCard) {
      const column = columns.find(c => c.id === columnId)
      const columnCards = getColumnCards(columnId)
      
      // Check WIP limit
      if (column && column.wipLimit > 0 && columnCards.length >= column.wipLimit) {
        toast.error(`WIP limit reached for ${column.name} (${column.wipLimit} cards max)`)
        setDraggedCard(null)
        return
      }
      
      moveCard(draggedCard, columnId)
      toast.success('Card moved successfully')
    }
    setDraggedCard(null)
  }

  const handleAddCard = () => {
    if (!newCard.title.trim()) {
      toast.error('Card title is required')
      return
    }
    
    addCard({
      columnId: selectedColumn,
      ...newCard,
      tags: []
    })
    
    setNewCard({
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: '',
      dueDate: '',
      tags: []
    })
    setNewCardDialog(false)
    toast.success('Card created successfully')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" size="sm" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lean Tools
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          <p className="text-muted-foreground mt-1">
            Visualize workflow and manage WIP limits
          </p>
        </div>
        <Dialog open={newCardDialog} onOpenChange={setNewCardDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedColumn(columns[0]?.id || '')}>
              <Plus className="mr-2 h-4 w-4" />
              New Card
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Card</DialogTitle>
              <DialogDescription>Add a new task card to your board</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Column</Label>
                <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(col => (
                      <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title *</Label>
                <Input
                  value={newCard.title}
                  onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                  placeholder="Enter card title"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newCard.description}
                  onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                  placeholder="Enter card description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select 
                    value={newCard.priority} 
                    onValueChange={(value: 'low' | 'medium' | 'high') => setNewCard({ ...newCard, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newCard.dueDate}
                    onChange={(e) => setNewCard({ ...newCard, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Assigned To</Label>
                <Input
                  value={newCard.assignedTo}
                  onChange={(e) => setNewCard({ ...newCard, assignedTo: e.target.value })}
                  placeholder="Enter assignee name"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewCardDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCard}>Create Card</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Board Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {columns.map(column => {
          const columnCards = getColumnCards(column.id)
          const isOverLimit = column.wipLimit > 0 && columnCards.length > column.wipLimit
          
          return (
            <Card key={column.id} className={isOverLimit ? 'border-red-500' : ''}>
              <CardHeader className="pb-3">
                <CardDescription>{column.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{columnCards.length}</div>
                {column.wipLimit > 0 && (
                  <p className={`text-xs mt-1 ${isOverLimit ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                    WIP Limit: {column.wipLimit}
                    {isOverLimit && ' ⚠️ EXCEEDED'}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => {
          const columnCards = getColumnCards(column.id)
          const isOverLimit = column.wipLimit > 0 && columnCards.length > column.wipLimit
          
          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <Card className={`h-full ${isOverLimit ? 'border-red-500 border-2' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{column.name}</CardTitle>
                      <Badge variant="secondary">{columnCards.length}</Badge>
                    </div>
                    {column.wipLimit > 0 && (
                      <Badge variant={isOverLimit ? 'destructive' : 'outline'}>
                        Limit: {column.wipLimit}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 min-h-[400px]">
                  {columnCards.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8 text-sm">
                      Drop cards here
                    </div>
                  ) : (
                    columnCards.map((card) => {
                      const daysUntilDue = getDaysUntilDue(card.dueDate)
                      const isOverdue = daysUntilDue !== null && daysUntilDue < 0
                      const isDueSoon = daysUntilDue !== null && daysUntilDue >= 0 && daysUntilDue <= 2
                      
                      return (
                        <div
                          key={card.id}
                          draggable
                          onDragStart={() => handleDragStart(card.id)}
                          className="p-3 border rounded-lg bg-white cursor-move hover:shadow-md transition-shadow"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-sm">{card.title}</h4>
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(card.priority)}`} />
                            </div>
                            
                            {card.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {card.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 flex-wrap">
                              {card.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              {card.assignedTo && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{card.assignedTo}</span>
                                </div>
                              )}
                              
                              {card.dueDate && (
                                <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : isDueSoon ? 'text-yellow-600 font-semibold' : ''}`}>
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {isOverdue 
                                      ? `${Math.abs(daysUntilDue!)}d overdue` 
                                      : isDueSoon
                                      ? `${daysUntilDue}d left`
                                      : new Date(card.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Priority Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm">High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Low Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm">WIP Limit Exceeded</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

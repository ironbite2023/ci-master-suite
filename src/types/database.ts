/**
 * Supabase Database Types
 * Auto-generated types for type safety
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company: string | null
          role: string | null
          certification_level: string | null
          avatar_url: string | null
          timezone: string
          preferences: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company?: string | null
          role?: string | null
          certification_level?: string | null
          avatar_url?: string | null
          timezone?: string
          preferences?: Record<string, unknown>
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company?: string | null
          role?: string | null
          certification_level?: string | null
          avatar_url?: string | null
          timezone?: string
          preferences?: Record<string, unknown>
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          type: string
          status: string
          priority: string
          start_date: string | null
          end_date: string | null
          budget: number | null
          metadata: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          description?: string | null
          type?: string
          status?: string
          priority?: string
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          metadata?: Record<string, unknown>
        }
        Update: {
          user_id?: string
          name?: string
          description?: string | null
          type?: string
          status?: string
          priority?: string
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
          metadata?: Record<string, unknown>
        }
      }
      analyses: {
        Row: {
          id: string
          project_id: string | null
          user_id: string
          tool_type: string
          tool_name: string
          name: string
          description: string | null
          status: string
          version: number
          config: Record<string, unknown>
          results: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          project_id?: string | null
          user_id: string
          tool_type: string
          tool_name: string
          name: string
          description?: string | null
          status?: string
          version?: number
          config?: Record<string, unknown>
          results?: Record<string, unknown>
        }
        Update: {
          project_id?: string | null
          user_id?: string
          tool_type?: string
          tool_name?: string
          name?: string
          description?: string | null
          status?: string
          version?: number
          config?: Record<string, unknown>
          results?: Record<string, unknown>
        }
      }
      kanban_boards: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          name: string
          description: string | null
          settings: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          project_id?: string | null
          name: string
          description?: string | null
          settings?: Record<string, unknown>
        }
        Update: {
          user_id?: string
          project_id?: string | null
          name?: string
          description?: string | null
          settings?: Record<string, unknown>
        }
      }
      kanban_columns: {
        Row: {
          id: string
          board_id: string
          name: string
          wip_limit: number
          position: number
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          board_id: string
          name: string
          wip_limit?: number
          position: number
          color?: string
        }
        Update: {
          board_id?: string
          name?: string
          wip_limit?: number
          position?: number
          color?: string
        }
      }
      kanban_cards: {
        Row: {
          id: string
          column_id: string
          title: string
          description: string | null
          priority: string
          due_date: string | null
          assigned_to: string | null
          tags: string[]
          position: number
          created_at: string
          moved_at: string
        }
        Insert: {
          column_id: string
          title: string
          description?: string | null
          priority?: string
          due_date?: string | null
          assigned_to?: string | null
          tags?: string[]
          position: number
        }
        Update: {
          column_id?: string
          title?: string
          description?: string | null
          priority?: string
          due_date?: string | null
          assigned_to?: string | null
          tags?: string[]
          position?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

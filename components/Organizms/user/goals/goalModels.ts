import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import { z } from 'zod'

export interface UserGoal extends UserTask {
  stats?: UserGoalStats
  deleteCompletedTasks?: boolean
  settings?: UserGoalSettings
}
export interface UserTask {
  goalId?: string
  id?: string
  body?: string
  dueDate?: string | null
  dateCompleted?: string | null
  dateCreated?: string
  dateModified?: string
  status?: 'completed' | 'in progress' | 'deferred'
  completePercent?: number
  notes?: string
  files?: S3Object[]
}

export interface UserGoalStats {
  inProgress: number
  completed: number
  pastDue: number
}

export interface UserGoalSettings {
  showCompletedTasks: boolean
}

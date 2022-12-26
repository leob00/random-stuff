export interface UserGoal extends UserTask {
  stats?: UserGoalStats
}
export interface UserTask {
  goalId?: string
  id?: string
  body?: string
  dueDate?: string
  dateCompleted?: string
  dateCreated?: string
  dateModified?: string
  status?: 'completed' | 'in progress' | 'deferred'
  completePercent?: number
  notes?: string
}

export interface UserGoalStats {
  inProgress: number
  completed: number
  pastDue: number
}

export interface UserGoal extends UserTask {
  tasks: UserTask[]
}
export interface UserTask {
  id?: string
  body?: string
  dueDate?: string
  dateCompleted?: string
  dateCreated?: string
  dateModified?: string
  status?: 'completed' | 'in progress' | 'deferred'
}

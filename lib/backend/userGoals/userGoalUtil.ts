import GoalDetails from 'components/Organizms/user/goals/GoalDetails'
import dayjs from 'dayjs'
import { UserGoal, UserGoalStats, UserTask } from 'lib/models/userTasks'
import { filter } from 'lodash'

export function getGoalStats(tasks: UserTask[]) {
  const stats: UserGoalStats = {
    inProgress: 0,
    completed: 0,
    pastDue: 0,
  }
  if (tasks.length === 0) {
    return stats
  }

  stats.inProgress = filter(tasks, (e) => e.status === 'in progress').length
  stats.completed = filter(tasks, (e) => e.status === 'completed').length
  stats.pastDue = filter(tasks, (e) => {
    return e.dueDate && e.status === 'in progress' && dayjs().isAfter(e.dueDate)
  }).length
  return stats
}

export function getWorkflowStatusText(status: number | null) {
  if (!status) {
    return 'unknown'
  }
  switch (status) {
    case 1:
      return 'In Progress'
    case 2:
      return 'Completed'
    case 3:
      return 'Finished with Error'
    default:
      return ''
  }
}

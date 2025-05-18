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

export function toCamelCase(val?: string | null) {
  if (!!val && val.length > 0) {
    const split = val.split(/[,;-\s]+/)
    let result = ''

    split.forEach((i) => {
      result = `${result} ${i.substring(0, 1).toUpperCase()}${i.substring(1).toLowerCase()}`
    })
    return result
  }
  return val
}

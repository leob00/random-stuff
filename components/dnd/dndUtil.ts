export type SortableItem = {
  id: string
  title: string
  data: unknown
}
export function getSortablePropsFromArray<T>(array: T[], id: keyof T, title: keyof T) {
  const result: SortableItem[] = array.map((m) => {
    return {
      data: m,
      id: String(m[id]),
      title: String(m[title]),
    }
  })

  return result
}

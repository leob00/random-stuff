import { Prettify } from 'lib/util/objects'

export type SortableItem = {
  id: string
  title: string
  data: unknown
}
export function getSortablePropsFromArray<T>(array: T[], id: keyof T, title: keyof T) {
  type Transformed = Prettify<{
    [K in keyof T]: {
      type: K
    } & T[K] &
      SortableItem
  }>

  const result: SortableItem[] = array.map((m) => {
    return {
      data: m,
      id: String(m[id]),
      title: String(m[title]),
      rawData: array,
    }
  })

  return result
}

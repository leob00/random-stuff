import { Prettify } from 'lib/util/objects'

export type SortableItem = {
  id: string
  title: string
  data: unknown
}

export type SortableItemEx<T> = {
  id: string
  title: string
  data: T
}

export function getSortablePropsFromArray<T>(array: T[], id: keyof T, title: keyof T) {
  const result: SortableItemEx<T>[] = array.map((m) => {
    return {
      data: m,
      id: String(m[id]),
      title: String(m[title]),
      rawData: array,
    }
  })

  return result
}

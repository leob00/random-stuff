import React from 'react'
import { chunk } from 'lodash'

export const usePager = <T>(items: T[], pageSize: number) => {
  const chunks = chunk(items, pageSize)
  const pageCount = chunks.length
  const map = new Map<number, T[]>()
  chunks.forEach((chunk, i) => {
    map.set(i + 1, chunk)
  })

  const [currentPageIndex, setCurrentPageIndex] = React.useState(1)
  const [displayItems, setDisplayItems] = React.useState(chunks.length > 0 ? chunks[0] : [])

  const setPage = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
    const newDisplayItems = Array.from(map.get(pageNum)!.values())
    setDisplayItems(newDisplayItems)
  }
  return {
    page: currentPageIndex,
    setPage,
    pageCount,
    displayItems: displayItems,
    allItems: [...items],
  }
}
export type Pager = ReturnType<typeof usePager>

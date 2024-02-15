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
  const [numberOfPages, setNumberOfPages] = React.useState(pageCount)

  const setPage = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
    const newDisplayItems = Array.from(map.get(pageNum)!.values())
    setDisplayItems(newDisplayItems)
  }
  const reset = (data: T[]) => {
    const newChunks = chunk(data, pageSize)
    const newPageCount = newChunks.length
    map.clear()
    newChunks.forEach((chunk, i) => {
      map.set(i + 1, chunk)
    })
    setCurrentPageIndex(1)
    setDisplayItems(chunks.length > 0 ? chunks[0] : [])
    setNumberOfPages(newPageCount)
  }
  return {
    page: currentPageIndex,
    setPage,
    pageCount: numberOfPages,
    displayItems: displayItems,
    reset,
  }
}

export type Pager = ReturnType<typeof usePager>

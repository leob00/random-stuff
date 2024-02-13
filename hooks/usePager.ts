import { getPagedArray } from 'lib/util/collections'
import React from 'react'
import { chunk } from 'lodash'

export const usePager = <T>(items: T[], pageSize: number) => {
  //const pagedStocks = getPagedArray(items, pageSize)
  const chunks = chunk(items, pageSize)
  const pageCount = chunks.length
  const map = new Map<number, T[]>()
  chunks.forEach((chunk, i) => {
    map.set(i, chunk)
  })

  const [currentPageIndex, setCurrentPageIndex] = React.useState(1)
  const [displayItems, setDisplayItems] = React.useState(Array.from(map.get(currentPageIndex)!.values()))

  const setPageIndex = (pageNum: number) => {
    setCurrentPageIndex(pageNum)
    setDisplayItems(Array.from(map.get(currentPageIndex)!.values()))
  }
  return {
    currentPageIndex,
    setPageIndex,
    pageCount,
    displayItems: displayItems,
  }
}
export type UserController = ReturnType<typeof usePager>

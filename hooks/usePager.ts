import React from 'react'
import { chunk } from 'lodash'

export const usePager = <T>(items: T[], pageSize: number) => {
  interface Model {
    page: number
    displayItems: T[]
    numberOfPages: number
  }

  const chunks = chunk(items, pageSize)
  const map = new Map<number, T[]>()
  chunks.forEach((chunk, i) => {
    map.set(i + 1, chunk)
  })

  // const [currentPageIndex, setCurrentPageIndex] = React.useState(1)
  // const [displayItems, setDisplayItems] = React.useState(chunks.length > 0 ? chunks[0] : [])
  // const [numberOfPages, setNumberOfPages] = React.useState(pageCount)

  const defaultModel: Model = {
    page: 1,
    displayItems: chunks.length > 0 ? chunks[0] : [],
    numberOfPages: chunks.length,
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const setPage = (pageNum: number) => {
    setModel({ ...model, page: pageNum })
    // setCurrentPageIndex(pageNum)
    // const newDisplayItems = Array.from(map.get(pageNum)!.values())
    // setDisplayItems(newDisplayItems)
  }
  const reset = (data: T[]) => {
    const newChunks = chunk(data, pageSize)
    map.clear()
    newChunks.forEach((chunk, i) => {
      map.set(i + 1, chunk)
    })
    setModel({ ...model, page: 1, displayItems: newChunks.length > 0 ? Array.from(map.get(1)!.values()) : [], numberOfPages: newChunks.length })
  }
  React.useEffect(() => {
    const newChunks = chunk(items, pageSize)
    map.clear()
    newChunks.forEach((chunk, i) => {
      map.set(i + 1, chunk)
    })
    setModel({ ...model, displayItems: newChunks.length > 0 ? Array.from(map.get(model.page)!.values()) : [], numberOfPages: newChunks.length })
  }, [model.page])
  return {
    page: model.page,
    setPage,
    pageCount: model.numberOfPages,
    displayItems: model.displayItems,
  }
}

export type Pager = ReturnType<typeof usePager>

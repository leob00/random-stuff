import React from 'react'
import { chunk } from 'lodash'

export const usePager = <T>(items: T[], pageSize: number) => {
  const [isReset, setIsReset] = React.useState(false)
  interface Model {
    page: number
    displayItems: T[] | unknown[]
    numberOfPages: number
    allItems: T[] | unknown[]
    isDirty: boolean
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
    allItems: items,
    isDirty: true,
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const setPage = (pageNum: number) => {
    setModel({ ...model, page: pageNum })
    // setCurrentPageIndex(pageNum)
    // const newDisplayItems = Array.from(map.get(pageNum)!.values())
    // setDisplayItems(newDisplayItems)
  }
  const reset = (data: T[] | unknown[]) => {
    const newChunks = chunk(data, pageSize)
    map.clear()
    newChunks.forEach((chunk, i) => {
      map.set(i + 1, chunk as T[])
    })
    setModel({ ...model, page: 1, allItems: data, displayItems: newChunks.length > 0 ? Array.from(map.get(1)!.values()) : [], numberOfPages: newChunks.length })
    setIsReset(true)
  }
  React.useEffect(() => {
    if (isReset) {
      setIsReset(false)
    } else {
      const newPage = model.page === 0 ? 1 : model.page
      const newChunks = chunk(model.allItems, pageSize)
      map.clear()
      newChunks.forEach((chunk, i) => {
        map.set(i + 1, chunk as T[])
      })
      setModel({
        ...model,
        page: newPage,
        displayItems: newChunks.length > 0 ? Array.from(map.get(newPage)!.values()) : [],
        numberOfPages: newChunks.length,
        isDirty: false,
      })
    }
  }, [model.page, isReset])

  return {
    page: model.page,
    setPage,
    pageCount: model.numberOfPages,
    displayItems: model.displayItems,
    allItems: model.allItems,
    reset,
    isDirty: model.isDirty,
  }
}

export type ListPager = ReturnType<typeof usePager>

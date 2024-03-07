import React from 'react'
import { chunk } from 'lodash'

interface PagerModel {
  page: number
  totalNumberOfPages: number
  totalNumberOfItems: number
}
const getDefaultModel = (items: unknown[], pageSize: number) => {
  const chunks = chunk(items, pageSize)

  const defaultModel: PagerModel = {
    page: 1,
    totalNumberOfPages: chunks.length,
    totalNumberOfItems: items.length,
  }
  return defaultModel
}

export const useClientPager = <T>(items: T[], pageSize: number) => {
  let itemTotal = items.length
  let allItems = [...items]
  const [model, setModel] = React.useReducer((state: PagerModel, newState: PagerModel) => ({ ...state, ...newState }), getDefaultModel(items, pageSize))

  const getPagedItems = <T>(data: T[]) => {
    const newChunks = chunk(data, pageSize)
    if (model.totalNumberOfPages !== newChunks.length) {
      setModel({ ...model, page: 1, totalNumberOfPages: newChunks.length, totalNumberOfItems: data.length })
      return newChunks.length > 0 ? newChunks[0] : []
    }
    return newChunks.length > 0 ? newChunks[model.page - 1] : []
  }

  const setPage = (pageNum: number) => {
    setModel({ ...model, page: pageNum })
  }
  const reset = (data: T[] | unknown[]) => {
    itemTotal = data.length
    allItems = [...data] as T[]
    const newChunks = chunk(data, pageSize)
    setModel({ ...model, page: 1, totalNumberOfPages: newChunks.length, totalNumberOfItems: data.length })
  }
  React.useEffect(() => {
    if (itemTotal !== model.totalNumberOfItems) {
      //console.log(`model items: ${model.totalNumberOfItems} new total: ${itemTotal}`)
      const newChunks = chunk(allItems, pageSize)
      setModel({ ...model, totalNumberOfItems: itemTotal, totalNumberOfPages: newChunks.length })
    }
  }, [itemTotal])

  return {
    pagerModel: model,
    setPage,
    reset,
    getPagedItems,
  }
}

export type ListClientPager = ReturnType<typeof useClientPager>

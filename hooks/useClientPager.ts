import { chunk } from 'lodash'
import { useEffect, useReducer } from 'react'

interface PagerModel {
  page: number
  totalNumberOfPages: number
  totalNumberOfItems: number
}
const getDefaultModel = (items: unknown[], pageSize: number, setLastPage?: boolean) => {
  const chunks = chunk(items, pageSize)

  const defaultModel: PagerModel = {
    page: setLastPage ? chunks.length : 1,
    totalNumberOfPages: chunks.length,
    totalNumberOfItems: items.length,
  }
  return defaultModel
}

export const useClientPager = <T>(items: T[], pageSize: number, setLastPage?: boolean) => {
  let itemTotal = items.length
  let allItems = [...items]
  const [model, setModel] = useReducer((state: PagerModel, newState: PagerModel) => ({ ...state, ...newState }), getDefaultModel(items, pageSize, setLastPage))

  const getPagedItems = <T>(data: T[], pageNum?: number) => {
    const newChunks = chunk(data, pageSize)
    if (model.totalNumberOfPages !== newChunks.length) {
      setModel({ ...model, page: pageNum ?? 1, totalNumberOfPages: newChunks.length, totalNumberOfItems: data.length })
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
  useEffect(() => {
    if (itemTotal !== model.totalNumberOfItems) {
      const newChunks = chunk(allItems, pageSize)
      setModel({ ...model, totalNumberOfItems: itemTotal, totalNumberOfPages: newChunks.length })
    }
  }, [itemTotal])

  return {
    allItems,
    pagerModel: model,
    setPage,
    reset,
    getPagedItems,
  }
}

export type ListClientPager = ReturnType<typeof useClientPager>

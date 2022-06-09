import { Pages } from '@mui/icons-material'
import { chunk } from 'lodash'
export interface Page {
  index: number
  items: any[]
}
export interface PagedCollection {
  pages: Page[]
}

export function pageItems(items: Array<any>, pageSize: number) {
  let result: PagedCollection = {
    pages: [],
  }
  let chunks = chunk(items, pageSize)
  chunks.forEach((chunk, index) => {
    result.pages.push({
      index: index + 1,
      items: chunk,
    })
  })
  return chunks
}

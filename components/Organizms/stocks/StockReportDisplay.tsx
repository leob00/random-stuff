import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import PagedStockTable from './PagedStockTable'
import { usePager } from 'hooks/usePager'

const StockReportDisplay = ({ data }: { data: StockQuote[] }) => {
  const pager = usePager(data, 5)
  return (
    <>
      <ScrollIntoView enabled={true} margin={-28} />
      <PagedStockTable data={data} pageSize={5} pager={pager} />
    </>
  )
}

export default StockReportDisplay

import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import PagedStockTable from './PagedStockTable'

const StockReportDisplay = ({ data }: { data: StockQuote[] }) => {
  return (
    <>
      <ScrollIntoView enabled={true} margin={-28} />
      <PagedStockTable data={data} pageSize={5} />
    </>
  )
}

export default StockReportDisplay

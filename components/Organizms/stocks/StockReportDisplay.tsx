import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import PagedStockTable from './PagedStockTable'
import { StockReportTypes } from 'lib/backend/api/qln/qlnModels'

const StockReportDisplay = ({ data, reportType }: { data: StockQuote[]; reportType: StockReportTypes }) => {
  let field: keyof StockQuote | undefined = undefined
  switch (reportType) {
    case 'marketcapleaders':
      field = 'MarketCapShort'
      break
    case 'volumeleaders':
      field = 'Volume'
  }

  return (
    <>
      <ScrollIntoView enabled={true} margin={-28} />
      <PagedStockTable data={data} pageSize={5} featuredField={field} />
    </>
  )
}

export default StockReportDisplay

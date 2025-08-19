import { StockQuote } from 'lib/backend/api/models/zModels'
import { StockReportTypes } from 'lib/backend/api/qln/qlnModels'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollTop from 'components/Atoms/Boxes/ScrollTop'
import SortableStockContainer from './SortableStockContainer'
import { StockQuoteSort } from 'lib/backend/api/models/collections'

const StockReportDisplay = ({ data, reportType }: { data: StockQuote[]; reportType: StockReportTypes }) => {
  let field: keyof StockQuote | undefined = undefined
  let defaultSort: StockQuoteSort[] | undefined = undefined
  switch (reportType) {
    case 'marketcapleaders':
      field = 'MarketCapShort'
      defaultSort = [{ key: 'MarketCap', direction: 'desc' }]
      break
    case 'volumeleaders':
      field = 'Volume'
      defaultSort = [{ key: 'Volume', direction: 'desc' }]
      break
    case 'indicesAndEtfs':
      field = 'Volume'
      defaultSort = [{ key: 'ChangePercent', direction: 'desc' }]
      break
  }

  const scroller = useScrollTop(0)

  const handlePageChange = () => {
    scroller.scroll()
  }

  return (
    <>
      <ScrollTop scroller={scroller} marginTop={-22} />
      <SortableStockContainer key={reportType} data={data} defaultSort={defaultSort} featuredField={field} reportType={reportType} />
    </>
  )
}

export default StockReportDisplay

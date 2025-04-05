import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import { StockQuote } from 'lib/backend/api/models/zModels'
import PagedStockTable from './PagedStockTable'
import { StockReportTypes } from 'lib/backend/api/qln/qlnModels'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollTop from 'components/Atoms/Boxes/ScrollTop'

const StockReportDisplay = ({ data, reportType }: { data: StockQuote[]; reportType: StockReportTypes }) => {
  let field: keyof StockQuote | undefined = undefined
  switch (reportType) {
    case 'marketcapleaders':
      field = 'MarketCapShort'
      break
    case 'volumeleaders':
      field = 'Volume'
  }

  const scroller = useScrollTop(0)

  const handlePageChange = () => {
    scroller.scroll()
  }

  return (
    <>
      <ScrollIntoView enabled={true} margin={-28} />
      <ScrollTop scroller={scroller} marginTop={-12} />
      <PagedStockTable key={reportType} data={data} pageSize={5} featuredField={field} scrollOnPageChange onPageChanged={handlePageChange} scrollInside />
    </>
  )
}

export default StockReportDisplay

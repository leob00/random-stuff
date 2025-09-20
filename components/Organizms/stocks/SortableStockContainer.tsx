import { Box } from '@mui/material'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { orderBy } from 'lodash'
import CustomSortAlert from './CustomSortAlert'
import PagedStockTable from './PagedStockTable'
import StocksCustomSortForm from './StocksCustomSortForm'
import { useState } from 'react'
import { StockQuoteSort } from 'lib/backend/api/models/collections'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollTop from 'components/Atoms/Boxes/ScrollTop'
import { StockReportTypes } from 'lib/backend/api/qln/qlnModels'

const SortableStockContainer = ({
  data,
  defaultSort,
  featuredField,
  reportType,
}: {
  data: StockQuote[]
  defaultSort?: StockQuoteSort[]
  featuredField?: keyof StockQuote
  reportType?: StockReportTypes
}) => {
  const [showSortForm, setShowSortForm] = useState(false)
  let defSort: StockQuoteSort[] = []
  if (defaultSort) {
    defSort = defaultSort
  } else {
    if (reportType === 'topmvgavg') {
      //defSort = [{key: 'ChangePercent', direction: 'desc'}]
    } else {
      defSort = defaultSort ?? [{ key: 'MarketCap', direction: 'desc' }]
    }
  }

  const [sort, setSort] = useState<StockQuoteSort[]>(defSort)
  let fieldToFeature: Array<keyof StockQuote> = defSort.some((m) => m.key === 'MarketCap')
    ? ['MarketCapShort']
    : !!featuredField
      ? [featuredField]
      : ['MarketCapShort']

  const handleSortChange = (newSort?: StockQuoteSort[]) => {
    setShowSortForm(false)
    if (newSort) {
      setSort(newSort)
    }
  }
  const sortData = () => {
    return orderBy(
      data,
      sort.map((m) => m.key),
      sort.map((m) => m.direction),
    )
  }
  const scroller = useScrollTop(0)

  const handlePageChange = () => {
    scroller.scroll()
  }
  return (
    <>
      {/* <ScrollIntoView enabled={true} margin={-28} /> */}
      <ScrollTop scroller={scroller} marginTop={-2} />
      <Box display='flex' justifyContent={'space-between'}>
        <Box flexGrow={1}>
          <CustomSortAlert result={sort} onModify={() => setShowSortForm(true)} translateDefaultMessage />
        </Box>
      </Box>
      <PagedStockTable data={sortData()} pageSize={10} sort={sort} featuredFields={fieldToFeature} scrollOnPageChange onPageChanged={handlePageChange} />
      <FormDialog title='sort' show={showSortForm} onCancel={() => setShowSortForm(false)}>
        <StocksCustomSortForm result={sort} onSubmitted={handleSortChange} required />
      </FormDialog>
    </>
  )
}

export default SortableStockContainer

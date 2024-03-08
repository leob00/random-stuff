import { Box } from '@mui/material'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuSort from 'components/Molecules/Menus/ContextMenuSort'
import { Sort } from 'lib/backend/api/aws/models/apiGatewayModels'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { orderBy } from 'lodash'
import React from 'react'
import CustomSortAlert from './CustomSortAlert'
import PagedStockTable from './PagedStockTable'
import StocksCustomSortForm from './StocksCustomSortForm'

const SortableStockContainer = ({ data, defaultSort }: { data: StockQuote[]; defaultSort?: Sort[] }) => {
  const [showSortForm, setShowSortForm] = React.useState(false)
  const [sort, setSort] = React.useState<Sort[]>(defaultSort ?? [{ key: 'MarketCap', direction: 'desc' }])

  const handleSortChange = (newSort?: Sort[]) => {
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
  return (
    <>
      <ScrollIntoView enabled={true} margin={-28} />
      <Box display='flex' justifyContent={'space-between'}>
        <Box flexGrow={1}>
          <CustomSortAlert result={sort} onModify={() => setShowSortForm(true)} />
        </Box>
      </Box>
      <PagedStockTable data={sortData()} pageSize={5} sort={sort} />
      <FormDialog title='sort' show={showSortForm} onCancel={() => setShowSortForm(false)}>
        <StocksCustomSortForm result={sort} onSubmitted={handleSortChange} required />
      </FormDialog>
    </>
  )
}

export default SortableStockContainer

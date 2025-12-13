import { Box, Typography, useTheme } from '@mui/material'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import SummaryTitle from '../SummaryTitle'
import { useState } from 'react'
import StockListItem from '../../StockListItem'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import PagedStockEarningsSummaryTable from './PagedStockEarningsSummaryTable'

const EarningsSummary = ({ data, title, isLoading }: { data?: StockEarning[]; title: string; isLoading?: boolean }) => {
  const [selectedItem, setSelectedItem] = useState<StockEarning | null>(null)
  return (
    <Box>
      <SummaryTitle title={title} />
      <Box>
        <Box display={'flex'} gap={2} alignItems={'center'}>
          <Box minWidth={68} pl={0}>
            <Typography variant='caption'></Typography>
          </Box>
          <Box minWidth={70} display={'flex'}>
            <Typography variant='caption'>actual</Typography>
          </Box>
          <Box minWidth={84} display={'flex'}>
            <Typography variant='caption'>estimate</Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>date</Typography>
          </Box>
        </Box>
      </Box>
      {isLoading && (
        <Box display={'flex'} justifyContent={'center'}>
          <ComponentLoader />
        </Box>
      )}
      {data && <PagedStockEarningsSummaryTable data={data} />}
      {selectedItem && selectedItem.StockQuote && (
        <InfoDialog show={true} title={selectedItem.Symbol} onCancel={() => setSelectedItem(null)}>
          <StockListItem item={selectedItem.StockQuote} marketCategory='stocks' userProfile={null} disabled expand />
        </InfoDialog>
      )}
    </Box>
  )
}

export default EarningsSummary

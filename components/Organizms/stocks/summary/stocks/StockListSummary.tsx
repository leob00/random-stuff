'use client'
import { Box, Typography } from '@mui/material'
import SummaryTitle from '../SummaryTitle'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import PagedStockSummaryTable from '../PagedStockSummaryTable'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import StockListItem from '../../StockListItem'
import { useState } from 'react'

const StockListSummary = ({
  userProfile,
  title,
  data,
  isLoading,
}: {
  userProfile: UserProfile | null
  title: string
  data?: StockQuote[]
  isLoading?: boolean
}) => {
  const [selectedItem, setSelectedItem] = useState<StockQuote | null>(null)
  return (
    <Box height={503}>
      <SummaryTitle title={title} />
      <Box>
        <Box display={'flex'} gap={2} alignItems={'center'}>
          <Box minWidth={70} pl={1}>
            <Typography variant='caption'></Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>price</Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>change</Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>percent</Typography>
          </Box>
        </Box>
      </Box>
      {isLoading && (
        <Box display={'flex'} justifyContent={'center'}>
          <ComponentLoader />
        </Box>
      )}
      {data && <PagedStockSummaryTable data={data} userProfile={userProfile} />}

      {selectedItem && (
        <InfoDialog show={true} title={selectedItem.Symbol} onCancel={() => setSelectedItem(null)}>
          <StockListItem item={selectedItem} marketCategory='stocks' userProfile={userProfile} disabled expand />
        </InfoDialog>
      )}
    </Box>
  )
}

export default StockListSummary

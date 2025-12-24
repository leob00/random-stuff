'use client'
import { Box, IconButton, Typography } from '@mui/material'
import SummaryTitle from '../SummaryTitle'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import PagedStockSummaryTable from '../PagedStockSummaryTable'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import StockListItem from '../../StockListItem'
import { useState } from 'react'
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { SortDirection } from 'lib/backend/api/models/collections'
import { sortArray } from 'lib/util/collections'

type StockSortDirection = 'default' | SortDirection

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
  const [sortDirection, setSortDirection] = useState<StockSortDirection>('default')

  const sorted = sortList(data ?? [], sortDirection)

  const handleSortDesc = () => {
    setSortDirection('desc')
  }

  const handleSortAsc = () => {
    setSortDirection('asc')
  }
  const handleSortDefault = () => {
    setSortDirection('default')
  }

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
          <Box minWidth={80} display={'flex'} alignItems={'center'} gap={1}>
            <Typography variant='caption'>%</Typography>
            {sortDirection === 'default' && (
              <IconButton onClick={handleSortDesc}>
                <SwapVertRoundedIcon color='primary' sx={{ fontSize: 18 }} />
              </IconButton>
            )}
            {sortDirection === 'desc' && (
              <IconButton onClick={handleSortAsc}>
                <ArrowDownwardIcon color='primary' sx={{ fontSize: 18 }} />
              </IconButton>
            )}
            {sortDirection === 'asc' && (
              <IconButton onClick={handleSortDefault}>
                <ArrowUpwardIcon color='primary' sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>
      {isLoading && (
        <Box display={'flex'} justifyContent={'center'}>
          <ComponentLoader />
        </Box>
      )}
      {data && <PagedStockSummaryTable data={sorted} userProfile={userProfile} />}

      {selectedItem && (
        <InfoDialog show={true} title={selectedItem.Symbol} onCancel={() => setSelectedItem(null)}>
          <StockListItem item={selectedItem} marketCategory='stocks' userProfile={userProfile} disabled expand />
        </InfoDialog>
      )}
    </Box>
  )
}

function sortList(data: StockQuote[], direction: StockSortDirection) {
  if (direction === 'default') {
    return data
  }
  return sortArray(data, ['ChangePercent'], [direction])
}

export default StockListSummary

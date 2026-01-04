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
import SearchIcon from '@mui/icons-material/Search'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import StockSearch from 'components/Atoms/Inputs/StockSearch'

export type StockSortDirection = 'default' | SortDirection

const StockListSummary = ({
  userProfile,
  title,
  data,
  isLoading,
  onRefreshRequest,
}: {
  userProfile: UserProfile | null
  title: string
  data?: StockQuote[]
  isLoading?: boolean
  onRefreshRequest?: () => void
}) => {
  const [selectedItem, setSelectedItem] = useState<StockQuote | null>(null)
  const [sortDirection, setSortDirection] = useState<StockSortDirection>('default')
  const sorted = sortList(data ?? [], sortDirection)
  const [showSearch, setShowSearch] = useState(false)

  const handleSortClick = () => {
    if (sortDirection === 'default') {
      setSortDirection('desc')
    }

    if (sortDirection === 'desc') {
      setSortDirection('asc')
    }
    if (sortDirection === 'asc') {
      setSortDirection('default')
    }
  }

  const handleQuoteSelected = (quote: StockQuote) => {
    const item = data?.find((m) => m.Symbol === quote.Symbol)
    if (item) {
      setSelectedItem(item)
    } else {
      setSelectedItem(quote)
    }
  }

  return (
    <Box height={513}>
      <SummaryTitle title={title} onRefresh={onRefreshRequest} />

      <Box>
        <Box display={'flex'} gap={2} alignItems={'center'} minHeight={44}>
          <Box pl={1} minHeight={40}>
            {!showSearch ? (
              <Box minWidth={60}>
                <IconButton size='small' onClick={() => setShowSearch(true)} color='primary'>
                  <SearchIcon fontSize='small' />
                </IconButton>
              </Box>
            ) : (
              <IconButton size='small' onClick={() => setShowSearch(false)} color='primary'>
                <SearchOffIcon fontSize='small' />
              </IconButton>
            )}
          </Box>
          {!showSearch ? (
            <>
              <Box minWidth={80} display={'flex'}>
                <Typography variant='caption'>price</Typography>
              </Box>
              <Box minWidth={80} display={'flex'}>
                <Typography variant='caption'>change</Typography>
              </Box>
              <Box minWidth={80} display={'flex'} alignItems={'center'} gap={1}>
                <Typography variant='caption'>%</Typography>
                {sortDirection === 'default' && (
                  <IconButton onClick={handleSortClick}>
                    <SwapVertRoundedIcon color='primary' sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
                {sortDirection === 'desc' && (
                  <IconButton onClick={handleSortClick}>
                    <ArrowDownwardIcon color='primary' sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
                {sortDirection === 'asc' && (
                  <IconButton onClick={handleSortClick}>
                    <ArrowUpwardIcon color='primary' sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Box>
            </>
          ) : (
            <>
              <Box display={'flex'}>
                <StockSearch onSymbolSelected={handleQuoteSelected} width={273} />
              </Box>
            </>
          )}
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

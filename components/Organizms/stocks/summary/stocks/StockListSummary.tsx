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
import StockSearch from 'components/Atoms/Inputs/StockSearch'
import { orderBy } from 'lodash'

export type StockSortDirection = 'default' | SortDirection

export type StockSort = {
  field: keyof StockQuote
  direction: StockSortDirection
}

const StockListSummary = ({
  userProfile,
  title,
  data,
  isLoading,
  onRefreshRequest,
  showCompanyName = true,
}: {
  userProfile: UserProfile | null
  title: string
  data?: StockQuote[]
  isLoading?: boolean
  onRefreshRequest?: () => void
  showCompanyName?: boolean
}) => {
  const [selectedItem, setSelectedItem] = useState<StockQuote | null>(null)
  const [stockSort, setStockSort] = useState<StockSort>({ field: 'ChangePercent', direction: 'default' })
  const sorted = sortList(data ?? [], stockSort)
  const [showSearch, setShowSearch] = useState(false)

  const handleSortClick = (sort: StockSort) => {
    setStockSort(sort)
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
      <SummaryTitle
        title={title}
        onRefresh={onRefreshRequest}
        searchSettings={{ allowSearch: true, searchOn: showSearch }}
        setSearchSettings={(settings) => {
          setShowSearch(settings.searchOn)
        }}
      />

      <Box>
        <Box display={'flex'} gap={2} alignItems={'center'} minHeight={44}>
          <Box pl={0.5} minHeight={40}>
            {!showSearch ? (
              <Box>
                <Box minWidth={64}>
                  {((stockSort.field === 'Symbol' && stockSort.direction === 'default') || stockSort.field !== 'Symbol') && (
                    <IconButton
                      onClick={() => {
                        handleSortClick({ field: 'Symbol', direction: 'asc' })
                      }}
                    >
                      <SwapVertRoundedIcon color='primary' sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                  {stockSort.field === 'Symbol' && stockSort.direction === 'desc' && (
                    <IconButton
                      onClick={() => {
                        handleSortClick({ field: 'Symbol', direction: 'default' })
                      }}
                    >
                      <ArrowDownwardIcon color='primary' sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                  {stockSort.field === 'Symbol' && stockSort.direction === 'asc' && (
                    <IconButton
                      onClick={() => {
                        handleSortClick({ field: 'Symbol', direction: 'desc' })
                      }}
                    >
                      <ArrowUpwardIcon color='primary' sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ) : (
              <Box></Box>
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
                {((stockSort.field === 'ChangePercent' && stockSort.direction === 'default') || stockSort.field !== 'ChangePercent') && (
                  <IconButton
                    onClick={() => {
                      handleSortClick({ field: 'ChangePercent', direction: 'asc' })
                    }}
                  >
                    <SwapVertRoundedIcon color='primary' sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
                {stockSort.field === 'ChangePercent' && stockSort.direction === 'desc' && (
                  <IconButton
                    onClick={() => {
                      handleSortClick({ field: 'ChangePercent', direction: 'default' })
                    }}
                  >
                    <ArrowDownwardIcon color='primary' sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
                {stockSort.field === 'ChangePercent' && stockSort.direction === 'asc' && (
                  <IconButton
                    onClick={() => {
                      handleSortClick({ field: 'ChangePercent', direction: 'desc' })
                    }}
                  >
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
      {data && <PagedStockSummaryTable data={sorted} userProfile={userProfile} showCompanyName={showCompanyName} />}

      {selectedItem && (
        <InfoDialog show={true} title={''} onCancel={() => setSelectedItem(null)}>
          <StockListItem item={selectedItem} marketCategory='stocks' userProfile={userProfile} disabled expand />
        </InfoDialog>
      )}
    </Box>
  )
}

function sortList(data: StockQuote[], sort: StockSort) {
  if (sort.direction === 'default') {
    return data
  } else {
    return orderBy(data, [sort.field], [sort.direction])
  }
}

export default StockListSummary

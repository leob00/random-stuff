'use client'
import { Box, IconButton, SortDirection, Typography } from '@mui/material'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import SummaryTitle from '../SummaryTitle'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import PagedStockEarningsSummaryTable from './PagedStockEarningsSummaryTable'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { useState } from 'react'
import { orderBy } from 'lodash'
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'

type EarningsSort = {
  field: keyof StockEarning
  direction: SortDirection | 'default'
}

const EarningsSummary = ({
  data,
  title,
  isLoading,
  userProfile,
  onRefreshRequest,
}: {
  data?: StockEarning[]
  title: string
  isLoading?: boolean
  userProfile: UserProfile | null
  onRefreshRequest?: () => void
}) => {
  const [earningsSort, setEarningsSort] = useState<EarningsSort>({ field: 'ReportDate', direction: 'default' })
  const [showSearch, setShowSearch] = useState(false)
  const [searchWithinList, setSearchWithinList] = useState('')

  const result = filterAndSortList(data ?? [], earningsSort, searchWithinList)

  const handleSortClick = (sort: EarningsSort) => {
    setEarningsSort(sort)
  }

  return (
    <Box height={513}>
      <SummaryTitle
        title={title}
        onRefresh={onRefreshRequest}
        searchSettings={{ allowSearch: true, searchOn: showSearch }}
        setSearchSettings={(settings) => {
          setShowSearch(settings.searchOn)
          if (!settings.searchOn) {
            setSearchWithinList('')
          }
        }}
      />
      <Box>
        <Box display={'flex'} gap={2} alignItems={'center'} minHeight={44}>
          <Box minHeight={40}>
            {!showSearch ? (
              <Box minWidth={60} display={'flex'} justifyContent={'flex-start'}>
                {((earningsSort.field === 'Symbol' && earningsSort.direction === 'default') || earningsSort.field !== 'Symbol') && (
                  <IconButton
                    onClick={() => {
                      handleSortClick({ field: 'Symbol', direction: 'asc' })
                    }}
                  >
                    <SwapVertRoundedIcon color='primary' sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
                {earningsSort.field === 'Symbol' && earningsSort.direction === 'desc' && (
                  <IconButton
                    onClick={() => {
                      handleSortClick({ field: 'Symbol', direction: 'default' })
                    }}
                  >
                    <ArrowDownwardIcon color='primary' sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
                {earningsSort.field === 'Symbol' && earningsSort.direction === 'asc' && (
                  <IconButton
                    onClick={() => {
                      handleSortClick({ field: 'Symbol', direction: 'desc' })
                    }}
                  >
                    <ArrowUpwardIcon color='primary' sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Box>
            ) : (
              <Box></Box>
            )}
          </Box>
          {!showSearch ? (
            <>
              <Box minWidth={60} display={'flex'}>
                <Typography variant='caption'>actual</Typography>
              </Box>
              <Box minWidth={60} display={'flex'}>
                <Typography variant='caption'>estimate</Typography>
              </Box>
              <Box minWidth={80} display={'flex'} alignItems={'center'} gap={1}>
                <Typography variant='caption'>date</Typography>
                {(earningsSort.field !== 'ReportDate' || earningsSort.direction === 'default') && (
                  <IconButton
                    onClick={() => {
                      handleSortClick({ field: 'ReportDate', direction: 'desc' })
                    }}
                  >
                    <SwapVertRoundedIcon color='primary' sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
                {earningsSort.field === 'ReportDate' && earningsSort.direction === 'desc' && (
                  <IconButton
                    onClick={() => {
                      handleSortClick({ field: 'ReportDate', direction: 'asc' })
                    }}
                  >
                    <ArrowDownwardIcon color='primary' sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
                {earningsSort.field === 'ReportDate' && earningsSort.direction === 'asc' && (
                  <IconButton
                    onClick={() => {
                      handleSortClick({ field: 'ReportDate', direction: 'default' })
                    }}
                  >
                    <ArrowUpwardIcon color='primary' sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Box>
            </>
          ) : (
            <>
              <Box display={'flex'} mt={-1.6} justifyContent={'center'}>
                <SearchWithinList
                  fullWidth
                  onChanged={(text) => {
                    setSearchWithinList(text)
                  }}
                />
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
      <Box>{data && <PagedStockEarningsSummaryTable data={result} userProfile={userProfile} />}</Box>
    </Box>
  )
}

function filterAndSortList(data: StockEarning[], sort: EarningsSort, searchWithinList: string) {
  let filtered = [...data]
  if (searchWithinList.length > 0) {
    filtered = filtered.filter(
      (m) => m.Symbol.toLowerCase().startsWith(searchWithinList.toLowerCase()) || m.StockQuote!.Company.toLowerCase().includes(searchWithinList.toLowerCase()),
    )
  }
  if (sort.direction === 'default') {
    return filtered
  } else {
    return orderBy(filtered, [sort.field], [sort.direction])
  }
}

export default EarningsSummary

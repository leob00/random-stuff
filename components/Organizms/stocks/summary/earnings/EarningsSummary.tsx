'use client'
import { Box, IconButton, SortDirection, Typography } from '@mui/material'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import SummaryTitle from '../SummaryTitle'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import PagedStockEarningsSummaryTable from './PagedStockEarningsSummaryTable'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import dayjs from 'dayjs'
import { useState } from 'react'
import { orderBy } from 'lodash'
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

type EarningsSort = {
  field: keyof StockEarning
  direction: SortDirection | 'default'
}

const EarningsSummary = ({
  data,
  title,
  isLoading,
  userProfile,
  singleDate,
}: {
  data?: StockEarning[]
  title: string
  isLoading?: boolean
  userProfile: UserProfile | null
  singleDate?: boolean
}) => {
  const [earningsSort, setEarningsSort] = useState<EarningsSort>({ field: 'ReportDate', direction: 'default' })

  const result = sortList(data ?? [], earningsSort)

  const handleSortClick = (sort: EarningsSort) => {
    setEarningsSort(sort)
  }

  return (
    <Box height={513}>
      <SummaryTitle title={title} />
      {singleDate && data && data.length > 0 && (
        <Typography variant='body2' textAlign={'center'} pb={1} mt={-1}>
          {dayjs(result[0].ReportDate).format('MM/DD/YYYY')}
        </Typography>
      )}
      <Box>
        <Box display={'flex'} gap={1} alignItems={'center'} minHeight={44}>
          <Box minWidth={68} pl={0}>
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
          <Box minWidth={70} display={'flex'}>
            <Typography variant='caption'>actual</Typography>
          </Box>
          <Box minWidth={70} display={'flex'}>
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
        </Box>
      </Box>
      {isLoading && (
        <Box display={'flex'} justifyContent={'center'}>
          <ComponentLoader />
        </Box>
      )}
      <Box>{data && <PagedStockEarningsSummaryTable data={result} userProfile={userProfile} singleDate={singleDate} />}</Box>
    </Box>
  )
}

function sortList(data: StockEarning[], sort: EarningsSort) {
  if (sort.direction === 'default') {
    return data
  } else {
    return orderBy(data, [sort.field], [sort.direction])
  }
}

export default EarningsSummary

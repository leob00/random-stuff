import { Box, IconButton, Typography } from '@mui/material'
import { StockSort } from './stocks/StockListSummary'
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

const OtherMarketsSummaryHeader = ({ stockSort, handleSortClick }: { stockSort: StockSort; handleSortClick: (sort: StockSort) => void }) => {
  return (
    <Box display={'flex'} gap={1} alignItems={'center'} minHeight={44}>
      <Box minWidth={120} pl={1}>
        <Typography variant='caption'></Typography>
        {((stockSort.field === 'Company' && stockSort.direction === 'default') || stockSort.field !== 'Company') && (
          <IconButton
            onClick={() => {
              handleSortClick({ field: 'Company', direction: 'asc' })
            }}
          >
            <SwapVertRoundedIcon color='primary' sx={{ fontSize: 18 }} />
          </IconButton>
        )}
        {stockSort.field === 'Company' && stockSort.direction === 'desc' && (
          <IconButton
            onClick={() => {
              handleSortClick({ field: 'Company', direction: 'default' })
            }}
          >
            <ArrowDownwardIcon color='primary' sx={{ fontSize: 18 }} />
          </IconButton>
        )}
        {stockSort.field === 'Company' && stockSort.direction === 'asc' && (
          <IconButton
            onClick={() => {
              handleSortClick({ field: 'Company', direction: 'desc' })
            }}
          >
            <ArrowUpwardIcon color='primary' sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>
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
    </Box>
  )
}

export default OtherMarketsSummaryHeader

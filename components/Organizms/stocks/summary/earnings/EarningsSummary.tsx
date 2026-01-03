'use client'
import { Box, Typography } from '@mui/material'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import SummaryTitle from '../SummaryTitle'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import PagedStockEarningsSummaryTable from './PagedStockEarningsSummaryTable'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import dayjs from 'dayjs'

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
  return (
    <Box height={503}>
      <SummaryTitle title={title} />
      {singleDate && data && data.length > 0 && (
        <Typography variant='body2' textAlign={'center'} pb={1} mt={-1}>
          {dayjs(data[0].ReportDate).format('MM/DD/YYYY')}
        </Typography>
      )}
      <Box>
        <Box display={'flex'} gap={1} alignItems={'center'}>
          <Box minWidth={68} pl={0}>
            <Typography variant='caption'></Typography>
          </Box>
          <Box minWidth={70} display={'flex'}>
            <Typography variant='caption'>actual</Typography>
          </Box>
          <Box minWidth={70} display={'flex'}>
            <Typography variant='caption'>estimate</Typography>
          </Box>

          <Box minWidth={70} display={'flex'}>
            <Typography variant='caption'>date</Typography>
          </Box>
        </Box>
      </Box>
      {isLoading && (
        <Box display={'flex'} justifyContent={'center'}>
          <ComponentLoader />
        </Box>
      )}
      <Box>{data && <PagedStockEarningsSummaryTable data={data} userProfile={userProfile} singleDate={singleDate} />}</Box>
    </Box>
  )
}

export default EarningsSummary

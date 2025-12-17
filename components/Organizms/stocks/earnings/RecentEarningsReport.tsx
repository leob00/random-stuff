import { Box } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import dayjs from 'dayjs'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { sortArray } from 'lib/util/collections'
import PositiveNegativePieChart from './PositiveNegativePieChart'
import RecentEarningsChart from './RecentEarningsChart'

const RecentEarningsReport = ({ data }: { data: StockEarning[] }) => {
  const reported = sortArray(
    data.filter((m) => !!m.ReportDate && !!m.ActualEarnings && dayjs().isAfter(m.ReportDate) && dayjs(m.ReportDate).isBefore(dayjs().subtract(1, 'days'))),
    ['ReportDate'],
    ['asc'],
  )

  return (
    <>
      <RecentEarningsChart reported={reported} />
      <Box py={2} display={'flex'} justifyContent={'center'}>
        <Box>
          <PositiveNegativePieChart reported={reported} />
        </Box>
      </Box>
    </>
  )
}

export default RecentEarningsReport

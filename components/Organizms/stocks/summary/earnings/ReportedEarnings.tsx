import { Box, Typography } from '@mui/material'
import SummaryTitle from '../SummaryTitle'

const ReportedEarnings = () => {
  return (
    <Box>
      <SummaryTitle title={'Resported Earnings'} />
      <Box>
        <Box display={'flex'} gap={2} alignItems={'center'}>
          <Box minWidth={70} pl={1}>
            <Typography variant='caption'></Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>date</Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>actual</Typography>
          </Box>
          <Box minWidth={80} display={'flex'}>
            <Typography variant='caption'>expected</Typography>
          </Box>
        </Box>
      </Box>
      <Box py={2} display={'flex'} justifyContent={'center'}>
        <Typography variant='caption'>coming soon...</Typography>
      </Box>
    </Box>
  )
}

export default ReportedEarnings

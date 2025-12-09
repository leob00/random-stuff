import { Box, CircularProgress, LinearProgress, Paper, Typography } from '@mui/material'
import CircleProgress from 'components/Atoms/Loaders/CircleProgress'
import DefaultTooltip from 'components/Atoms/Tooltips/DefaultTooltip'
import { Job } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'

const JobInProgress = ({ item }: { item: Job }) => {
  return (
    <Box minHeight={50} pt={2} pb={2}>
      <Paper elevation={1}>
        <Box px={2} py={1} display={'flex'} gap={2} alignItems={'center'}>
          <Box>
            <DefaultTooltip text={`Records: ${numeral(item.RecordsProcessed).format('###,###')}`}>
              <CircleProgress progress={item.ProgressPercent} />
            </DefaultTooltip>
          </Box>
          <Box>
            <Typography variant='caption' sx={{ p: 1 }}>
              {item.LastMessage}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default JobInProgress

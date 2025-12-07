import { Box, CircularProgress, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import numeral from 'numeral'
import duration from 'dayjs/plugin/duration'
import { getDuration, TimeDuration } from 'lib/util/dateUtil'
import { calculatePercent } from 'lib/util/numberUtil'
dayjs.extend(duration)

const Countdown = ({ title, start, current, end }: { title: string; current: string; start: string; end: string }) => {
  const spanFromStart = getDuration(start, end)
  const span = getDuration(current, end)
  const secondsFromStartToEnd = spanFromStart.totalSeconds
  const secondsFromCurrentToEnd = span.totalSeconds
  const summary = getDurationText(span)
  const progress = calculatePercent(secondsFromCurrentToEnd, secondsFromStartToEnd)
  return (
    <Box pt={2}>
      <CenterStack>
        <Typography variant='caption'>{title}</Typography>
      </CenterStack>
      <Box py={1}>
        <Typography variant='h6' fontWeight={'bold'}>
          {summary}
        </Typography>
      </Box>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress enableTrackSlot variant='determinate' color='primary' value={progress} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant='caption' fontSize={12} component='div'>{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

function getDurationText(span: TimeDuration) {
  let result = ''

  if (span.hours > 0) {
    result = `${result}${numeral(span.hours).format('00')}:`
  }
  result = `${result}${numeral(span.minutes).format('00')}:`
  result = `${result}${numeral(span.seconds).format('00')}`
  return result
}

export default Countdown

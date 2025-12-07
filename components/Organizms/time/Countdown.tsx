import { Box, CircularProgress, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import numeral from 'numeral'
import duration from 'dayjs/plugin/duration'
import { getDuration, TimeDuration } from 'lib/util/dateUtil'
import { calculatePercent } from 'lib/util/numberUtil'
import CircleProgress from 'components/Atoms/Loaders/CircleProgress'
dayjs.extend(duration)

const Countdown = ({ title, start, current, end }: { title: string; current: string; start: string; end: string }) => {
  const spanFromStart = getDuration(start, end)
  const span = getDuration(current, end)
  const secondsFromStartToEnd = spanFromStart.totalSeconds
  const secondsFromCurrentToEnd = span.totalSeconds
  const summary = getDurationText(span)
  const progress = 100 - calculatePercent(secondsFromCurrentToEnd, secondsFromStartToEnd)
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
      <CircleProgress progress={progress} />
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

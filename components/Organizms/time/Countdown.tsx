import { Box, CircularProgress, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { getDuration, TimeDuration } from 'lib/util/dateUtil'
import { calculatePercent } from 'lib/util/numberUtil'
import CircleProgress from 'components/Atoms/Loaders/CircleProgress'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

const Countdown = ({ title, start, current, end }: { title?: string; current: string; start: string; end: string }) => {
  const spanFromStart = getDuration(start, end)
  const span = getDuration(current, end)
  const secondsFromStartToEnd = spanFromStart.totalSeconds
  const secondsFromCurrentToEnd = span.totalSeconds
  const durationTimeString = getDurationText(span)
  const progress = 100 - calculatePercent(secondsFromCurrentToEnd, secondsFromStartToEnd)
  return (
    <Box pt={2}>
      {title && (
        <CenterStack>
          <Typography variant='caption'>{title}</Typography>
        </CenterStack>
      )}
      <Box py={1}>
        <Typography variant='h6' fontWeight={'bold'}>
          {durationTimeString}
        </Typography>
      </Box>
      <CircleProgress progress={progress} />
    </Box>
  )
}

export function getDurationText(span: TimeDuration) {
  let result = ''
  if (span.totalSeconds <= 0) {
    return '00:00:00'
  }

  if (span.hours > 0) {
    result = `${result}${numeral(Math.floor(span.hours)).format('00')}:`
  }
  result = `${result}${numeral(span.minutes).format('00')}:`
  result = `${result}${numeral(span.seconds).format('00')}`
  return result
}

export default Countdown

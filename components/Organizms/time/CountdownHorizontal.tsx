import { Box, CircularProgress, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { getDuration, TimeDuration } from 'lib/util/dateUtil'
import { calculatePercent } from 'lib/util/numberUtil'
import CircleProgress from 'components/Atoms/Loaders/CircleProgress'
import duration from 'dayjs/plugin/duration'
import { getDurationText } from './Countdown'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
dayjs.extend(duration)

const CountdownHorizontal = ({ title, start, current, end }: { title?: string; current: string; start: string; end: string }) => {
  const spanFromStart = getDuration(start, end)
  const span = getDuration(current, end)
  const secondsFromStartToEnd = spanFromStart.totalSeconds
  const secondsFromCurrentToEnd = span.totalSeconds
  const summary = getDurationText(span)
  const progress = 100 - calculatePercent(secondsFromCurrentToEnd, secondsFromStartToEnd)
  return (
    <Box display={'flex'} gap={1} alignItems={'center'}>
      {title && (
        <Typography variant='body2' color={CasinoBlueTransparent}>
          {title}
        </Typography>
      )}
      <Box>
        <Typography variant='h6' fontWeight={'bold'} color={CasinoBlueTransparent}>
          {summary}
        </Typography>
      </Box>
      <Box>
        <CircleProgress progress={progress} />
      </Box>
    </Box>
  )
}

export default CountdownHorizontal

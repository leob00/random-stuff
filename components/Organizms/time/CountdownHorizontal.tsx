import { Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { getDuration } from 'lib/util/dateUtil'
import duration from 'dayjs/plugin/duration'
import { getDurationText } from './Countdown'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
dayjs.extend(duration)

const CountdownHorizontal = ({
  title,
  start,
  current,
  end,
  summaryColor = CasinoBlueTransparent,
}: {
  title?: string
  current: string
  start: string
  end: string
  summaryColor?: string
}) => {
  const span = getDuration(current, end)
  const summary = getDurationText(span)
  return (
    <Box display={'flex'} gap={1} alignItems={'center'}>
      {title && (
        <Typography variant='body2' color={summaryColor}>
          {title}
        </Typography>
      )}
      <Box>
        <Typography variant='h6' fontWeight={'bold'} color={summaryColor}>
          {summary}
        </Typography>
      </Box>
    </Box>
  )
}

export default CountdownHorizontal

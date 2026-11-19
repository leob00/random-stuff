'use client'

import { Box, Typography } from '@mui/material'
import theme from 'components/themes/mainTheme'
import { Usage } from 'lib/backend/api/models/antropic'
import numeral from 'numeral'

const TokenUsage = ({ usage }: { usage: Usage }) => {
  return (
    <Box display={'flex'} flexDirection={'row'} gap={2} alignItems={'center'} py={1}>
      <Box display={'flex'} gap={1} alignItems={'center'}>
        <Typography color={theme.palette.secondary.main} variant='caption'>
          input tokens:
        </Typography>
        <Typography color={theme.palette.secondary.main} variant='caption' fontWeight={'bold'}>
          {`${numeral(usage.input_tokens).format('###,###')}`}
        </Typography>
      </Box>
      <Box display={'flex'} gap={1} alignItems={'center'}>
        <Typography color={theme.palette.secondary.main} variant='caption'>
          output tokens:
        </Typography>
        <Typography color={theme.palette.secondary.main} variant='caption' fontWeight={'bold'}>
          {`${numeral(usage.output_tokens).format('###,###')}`}
        </Typography>
      </Box>
    </Box>
  )
}

export default TokenUsage

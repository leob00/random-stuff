import { Box, LinearProgress, Typography } from '@mui/material'
import DefaultTooltip from 'components/Atoms/Tooltips/DefaultTooltip'
import { Job } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

const JobInProgress = ({ item }: { item: Job }) => {
  return (
    <Box minHeight={50} pt={2}>
      <Box>
        <DefaultTooltip text={`${item.ProgressPercent}%`}>
          <LinearProgress variant='determinate' value={item.ProgressPercent} color='secondary' />
        </DefaultTooltip>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>
          <Box>
            <Typography variant='caption' sx={{ p: 1 }}>
              {item.LastMessage}
            </Typography>
          </Box>
          {item.ProgressPercent && (
            <Box pr={1}>
              <Typography variant='caption'>{`${item.ProgressPercent.toFixed(1)}%`}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default JobInProgress
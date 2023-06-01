import { Box, LinearProgress, Typography } from '@mui/material'
import DefaultTooltip from 'components/Atoms/Tooltips/DefaultTooltip'
import { Job } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import React from 'react'

const JobInProgress = ({ item }: { item: Job }) => {
  return (
    <Box minHeight={50} pt={2}>
      <Box>
        <DefaultTooltip text={`Records: ${numeral(item.RecordsProcessed).format('###,###')}`}>
          <LinearProgress variant='determinate' value={item.ProgressPercent} color='secondary' />
        </DefaultTooltip>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>
          <Box>
            <Typography variant='caption' sx={{ p: 1 }}>
              {item.LastMessage}
            </Typography>
          </Box>
          {item.ProgressPercent && item.ProgressPercent > 0 && (
            <Box pr={1}>
              <Typography variant='caption'>{`${Math.ceil(item.ProgressPercent)}%`}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default JobInProgress

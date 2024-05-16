import { Box, LinearProgress, Paper, Typography } from '@mui/material'
import DefaultTooltip from 'components/Atoms/Tooltips/DefaultTooltip'
import { Job } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import React from 'react'

const JobInProgress = ({ item }: { item: Job }) => {
  return (
    <Box minHeight={50} pt={2} pb={2}>
      <Box pl={2} pr={2}>
        <DefaultTooltip text={`Records: ${numeral(item.RecordsProcessed).format('###,###')}`}>
          <Paper elevation={4}>
            {item.Name === 'ProcessYahooEarnings' ? (
              <LinearProgress variant='indeterminate' value={item.ProgressPercent} color='info' />
            ) : (
              <LinearProgress variant='determinate' value={item.ProgressPercent} color='info' />
            )}
          </Paper>
        </DefaultTooltip>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-start'}>
          <Box>
            <Typography variant='caption' sx={{ p: 1 }}>
              {item.LastMessage}
            </Typography>
          </Box>
          {item.ProgressPercent !== undefined && item.ProgressPercent !== 0 && (
            <Box pr={1}>
              <Typography variant='caption'>{`${Math.ceil(item.ProgressPercent ?? 0)}%`}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default JobInProgress

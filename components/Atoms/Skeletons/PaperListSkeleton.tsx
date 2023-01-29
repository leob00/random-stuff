import { Box, Paper, Typography } from '@mui/material'
import { range } from 'lodash'
import React from 'react'
import TextSkeleton from './TextSkeleton'

const PaperListSkeleton = ({ rowCount = 6 }: { rowCount?: number }) => {
  const r = range(0, rowCount ?? 5)
  return (
    <>
      {r.map((item, i) => (
        <Box py={2} key={i}>
          <Paper>
            <Box pl={4} pb={2}>
              <Typography textAlign={'left'} variant='h6'>
                <TextSkeleton />
              </Typography>
              <Box pt={1} pb={1}>
                <Typography textAlign={'left'} variant='h6'>
                  <TextSkeleton />
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      ))}
    </>
  )
}

export default PaperListSkeleton

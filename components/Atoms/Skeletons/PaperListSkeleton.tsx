import { Box, ListItem, Paper, Stack, Typography } from '@mui/material'
import { range } from 'lodash'
import React from 'react'
import TextSkeleton from './TextSkeleton'

const PaperListSkeleton = ({ rowCount = 6 }: { rowCount?: number }) => {
  const r = range(0, rowCount ?? 5)
  return (
    <>
      {r.map((item, i) => (
        <Box py={2} key={i} pl={1}>
          <Paper>
            <Box pl={4} pb={1}>
              <Typography textAlign={'left'} variant='h6'>
                <TextSkeleton width={200} animation='wave' />
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

import { Box, ListItem, Paper, Stack, Typography } from '@mui/material'
import { range } from 'lodash'
import React from 'react'
import TextSkeleton from './TextSkeleton'

const PaperListSkeleton = ({ rowCount = 6 }: { rowCount?: number }) => {
  const r = range(0, rowCount ?? 5)
  return (
    <>
      {r.map((item, i) => (
        <Box pb={1} key={i}>
          <Box pl={6} pb={1} pt={1}>
            <Typography textAlign={'left'} variant='h6'>
              <TextSkeleton width={200} animation='wave' />
            </Typography>
            <Box pt={1} pb={1}>
              <Typography textAlign={'left'} variant='h6'>
                <TextSkeleton />
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </>
  )
}

export default PaperListSkeleton

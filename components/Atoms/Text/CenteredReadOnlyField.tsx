import { Box, Typography } from '@mui/material'
import React from 'react'
import ReadOnlyField from './ReadOnlyField'

const CenteredReadOnlyField = ({ label, val, labelLength }: { label?: string; val: string | null | number; labelLength?: number }) => {
  return (
    <Box pt={1}>
      <Box display={'flex'} gap={1}>
        <Box justifyContent={'flex-end'} flexGrow={1} textAlign={'right'}>
          {label && <Typography variant={'caption'}>{`${label}:`}</Typography>}
        </Box>
        <Box flexGrow={1} textAlign={'left'}>
          {val && <Typography variant={'caption'}>{`${val}`}</Typography>}
        </Box>
      </Box>
    </Box>
  )
}

export default CenteredReadOnlyField

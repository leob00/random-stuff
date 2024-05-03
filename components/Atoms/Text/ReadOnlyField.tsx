import { Box, Stack, Typography, useTheme } from '@mui/material'
import React from 'react'

const ReadOnlyField = ({ label, val, labelLength }: { label?: string; val?: string | null | number; labelLength?: number }) => {
  const theme = useTheme()
  const textColor = theme.palette.primary.main
  return (
    <Box>
      <Box display={'flex'} flexDirection={'row'} gap={2} py={1}>
        {label !== undefined && (
          <Box textAlign={'right'} minWidth={labelLength ?? undefined}>
            <Typography variant={'body2'} color={'primary'}>{`${label}:`}</Typography>
          </Box>
        )}
        {val !== undefined && (
          <Box>
            <Typography variant={'body2'} color={'primary'}>
              {val}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ReadOnlyField

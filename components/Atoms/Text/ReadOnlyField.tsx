import { Stack, Typography } from '@mui/material'
import React from 'react'

const ReadOnlyField = ({ label, val }: { label: string; val?: string | null | number }) => {
  return (
    <>
      {val !== undefined && (
        <Stack direction={'row'} spacing={2} py={1} alignItems={'center'}>
          <Stack minWidth={80} textAlign={'right'}>
            <Typography variant={'body2'}>{`${label}:`}</Typography>
          </Stack>
          <Stack>
            <Typography variant={'body2'} color={'primary'}>
              {val}
            </Typography>
          </Stack>
        </Stack>
      )}
    </>
  )
}

export default ReadOnlyField

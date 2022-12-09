import { Skeleton } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const TextSkeleton = () => {
  return (
    <>
      <Skeleton variant='text' sx={{ bgcolor: VeryLightBlueTransparent, width: 100 }}></Skeleton>
    </>
  )
}

export default TextSkeleton

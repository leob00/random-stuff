import { Skeleton } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import React, { ReactNode } from 'react'

const TextSkeleton = ({ children, width = 100, animation = 'pulse' }: { children?: ReactNode; width?: number; animation?: 'pulse' | 'wave' }) => {
  return (
    <>
      <Skeleton variant='text' sx={{ bgcolor: VeryLightBlueTransparent, width: width }} animation={animation}>
        {children}
      </Skeleton>
    </>
  )
}

export default TextSkeleton

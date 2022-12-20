import { Skeleton } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import React, { ReactNode } from 'react'

const TextSkeleton = ({ children, width = 100 }: { children?: ReactNode; width?: number }) => {
  return (
    <>
      <Skeleton variant='text' sx={{ bgcolor: VeryLightBlueTransparent, width: width }}>
        {children}
      </Skeleton>
    </>
  )
}

export default TextSkeleton

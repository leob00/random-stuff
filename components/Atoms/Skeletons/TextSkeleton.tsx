import { Skeleton } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'
import SecondaryButton from '../Buttons/SecondaryButton'
import SearchWithinList from '../Inputs/SearchWithinList'

const TextSkeleton = () => {
  return (
    <>
      <Skeleton variant='text' sx={{ bgcolor: VeryLightBlueTransparent, width: 100 }}></Skeleton>
    </>
  )
}

export default TextSkeleton

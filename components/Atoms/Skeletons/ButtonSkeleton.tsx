import { Skeleton } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'
import SecondaryButton from '../Buttons/SecondaryButton'

const ButtonSkeleton = ({ buttonText }: { buttonText: string }) => {
  return (
    <>
      <Skeleton
        variant='text'
        sx={{ bgcolor: VeryLightBlueTransparent }}
        //height={80}
        //animation='pulse'
      >
        <SecondaryButton text={buttonText} disabled />
      </Skeleton>
    </>
  )
}

export default ButtonSkeleton

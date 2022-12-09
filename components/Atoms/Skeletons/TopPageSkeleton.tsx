import { Skeleton, Box } from '@mui/material'
import { VeryLightBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'
import CenterStack from '../CenterStack'

const TopPageSkeleton = () => {
  return (
    <>
      <CenterStack>
        <Skeleton
          variant='text'
          sx={{ textAlign: 'center', padding: 2, bgcolor: VeryLightBlueTransparent, fontSize: 20, fontWeight: 550 }}
          width={200}
          height={60}
        />
      </CenterStack>
      <Box>
        <Skeleton variant='circular' height={30} width={30} sx={{ bgcolor: VeryLightBlueTransparent }} />
      </Box>
      <Box>
        <CenterStack sx={{ py: 1 }}>
          <Skeleton width={206} height={72} sx={{ textAlign: 'center', bgcolor: VeryLightBlueTransparent, fontSize: 20, fontWeight: 550 }}></Skeleton>
        </CenterStack>
      </Box>
    </>
  )
}

export default TopPageSkeleton

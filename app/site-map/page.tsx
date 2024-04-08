import { Typography } from '@mui/material'
import SiteCategories from 'components/app/server/Atoms/Links/SiteCategories'
import CenterStack from 'components/Atoms/CenterStack'
import CircleLoader from 'components/Atoms/Loaders/CircleLoader'
import React, { Suspense } from 'react'

export default async function Page() {
  return (
    <>
      <Suspense fallback={<CircleLoader />}>
        <CenterStack sx={{ pb: 4 }}>
          <Typography variant='h5'>site map</Typography>
        </CenterStack>

        <SiteCategories />
      </Suspense>
    </>
  )
}

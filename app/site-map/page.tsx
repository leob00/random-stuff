import { Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { siteMap } from 'components/Organizms/navigation/siteMap'
import React from 'react'

export default async function Page() {
  const map = siteMap()

  return (
    <>
      <CenterStack>
        <Typography variant='h5'>site map</Typography>
      </CenterStack>
      <Typography>coming soon!</Typography>
    </>
  )
}

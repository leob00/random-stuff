import { Box } from '@mui/material'
import React from 'react'
import BackButton from '../Buttons/BackButton'
import CenterStack from '../CenterStack'
import HorizontalDivider from '../Dividers/HorizontalDivider'
import CenteredHeader from '../Boxes/CenteredHeader'
import BasicBreadcrumbs from '../Navigation/Breadcrumbs'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'

const PageHeader = ({ text, backButtonRoute }: { text: string; backButtonRoute?: string }) => {
  const { previousRoute } = useRouteTracker()

  return (
    <>
      <Box sx={{ display: { xs: 'none', sm: 'unset' } }}>
        <BasicBreadcrumbs />
      </Box>
      <Box sx={{ display: { xs: 'unset', sm: 'none' } }}>
        <Box display={'flex'}>{backButtonRoute ? <BackButton route={backButtonRoute} /> : <BackButton route={previousRoute} />}</Box>
      </Box>
      <CenterStack>
        <CenteredHeader title={text} />
      </CenterStack>
      <HorizontalDivider />
    </>
  )
}

export default PageHeader

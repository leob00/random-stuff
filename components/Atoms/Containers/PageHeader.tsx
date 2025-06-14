'use client'
import { Box } from '@mui/material'
import BackButton from '../Buttons/BackButton'
import CenterStack from '../CenterStack'
import HorizontalDivider from '../Dividers/HorizontalDivider'
import CenteredHeader from '../Boxes/CenteredHeader'
import BasicBreadcrumbs from '../Navigation/Breadcrumbs'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'

const PageHeader = ({ text, backButtonRoute, forceShowBackButton }: { text: string; backButtonRoute?: string; forceShowBackButton?: boolean }) => {
  const { previousRoute } = useRouteTracker()

  return (
    <>
      <Box sx={{ display: { xs: 'none', sm: 'unset' } }}>
        <BasicBreadcrumbs />
      </Box>
      {forceShowBackButton ? (
        <Box display={'flex'}>{backButtonRoute ? <BackButton route={backButtonRoute} /> : <BackButton route={previousRoute.path} />}</Box>
      ) : (
        <Box sx={{ display: { xs: 'unset', sm: 'none' } }}>
          <Box display={'flex'}>{backButtonRoute ? <BackButton route={backButtonRoute} /> : <BackButton route={previousRoute.path} />}</Box>
        </Box>
      )}
      <CenterStack sx={{ py: 2 }}>
        <CenteredHeader title={text} />
      </CenterStack>
      <HorizontalDivider />
    </>
  )
}

export default PageHeader

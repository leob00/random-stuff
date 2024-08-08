import { Box } from '@mui/material'
import React from 'react'
import BackButton from '../Buttons/BackButton'
import CenterStack from '../CenterStack'
import HorizontalDivider from '../Dividers/HorizontalDivider'
import CenteredHeader from '../Boxes/CenteredHeader'
import BasicBreadcrumbs from '../Navigation/Breadcrumbs'

const PageHeader = ({ text, backButtonRoute, onBackButtonClick }: { text: string; backButtonRoute?: string; onBackButtonClick?: () => void }) => {
  return (
    <>
      <Box sx={{ display: { xs: 'none', sm: 'unset' } }}>
        <BasicBreadcrumbs />
      </Box>
      <Box sx={{ display: { xs: 'unset', sm: 'none' } }}>
        <Box display={'flex'}>{onBackButtonClick ? <BackButton onClicked={onBackButtonClick} /> : <BackButton route={backButtonRoute} />}</Box>
      </Box>
      <CenterStack>
        <CenteredHeader title={text} />
      </CenterStack>
      <HorizontalDivider />
    </>
  )
}

export default PageHeader

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
      {/* <Box sx={{ display: { xs: 'none', md: 'unset' } }}>
        <BasicBreadcrumbs />
      </Box> */}
      <Box display={'flex'}>{onBackButtonClick ? <BackButton onClicked={onBackButtonClick} /> : <BackButton route={backButtonRoute} />}</Box>
      <CenterStack>
        <CenteredHeader title={text} />
      </CenterStack>
      <HorizontalDivider />
    </>
  )
}

export default PageHeader

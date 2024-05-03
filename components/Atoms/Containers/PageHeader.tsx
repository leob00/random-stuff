import { Box } from '@mui/material'
import React from 'react'
import BackButton from '../Buttons/BackButton'
import CenterStack from '../CenterStack'
import HorizontalDivider from '../Dividers/HorizontalDivider'
import CenteredHeader from '../Boxes/CenteredHeader'

const PageHeader = ({ text, backButtonRoute, onBackButtonClick }: { text: string; backButtonRoute?: string; onBackButtonClick?: () => void }) => {
  return (
    <>
      <Box display={'flex'}>{onBackButtonClick ? <BackButton onClicked={onBackButtonClick} /> : <BackButton route={backButtonRoute} />}</Box>
      <CenterStack>
        <CenteredHeader title={text} />
      </CenterStack>
      <HorizontalDivider />
    </>
  )
}

export default PageHeader

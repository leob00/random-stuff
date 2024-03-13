import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import BackButton from '../Buttons/BackButton'
import CenterStack from '../CenterStack'
import HorizontalDivider from '../Dividers/HorizontalDivider'
import CenteredTitle from '../Text/CenteredTitle'

const PageHeader = ({ text, backButtonRoute, onBackButtonClick }: { text: string; backButtonRoute?: string; onBackButtonClick?: () => void }) => {
  const router = useRouter()
  return (
    <>
      <Box display={'flex'}>{onBackButtonClick ? <BackButton onClicked={onBackButtonClick} /> : <BackButton route={backButtonRoute} />}</Box>
      <CenterStack>
        <CenteredTitle title={text} />
      </CenterStack>
      <HorizontalDivider />
    </>
  )
}

export default PageHeader

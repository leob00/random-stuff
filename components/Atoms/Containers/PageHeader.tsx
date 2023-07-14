import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import BackButton from '../Buttons/BackButton'
import CenterStack from '../CenterStack'
import HorizontalDivider from '../Dividers/HorizontalDivider'
import CenteredTitle from '../Text/CenteredTitle'

const PageHeader = ({ text, backButtonRoute }: { text: string; backButtonRoute?: string }) => {
  const router = useRouter()
  return (
    <>
      {backButtonRoute && (
        <Box display={'flex'}>
          <BackButton
            onClicked={() => {
              router.push(backButtonRoute)
            }}
          />
        </Box>
      )}
      <CenterStack>
        <CenteredTitle title={text} />
      </CenterStack>
      <HorizontalDivider />
    </>
  )
}

export default PageHeader

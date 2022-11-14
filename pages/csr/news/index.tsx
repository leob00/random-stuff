import React from 'react'
import { Button, Box, Stack } from '@mui/material'
import router from 'next/router'
import CenteredTitle from 'components/Atoms/Containers/CenteredTitle'
import { newsTypes } from 'lib/backend/api/qln/qlnApi'
import { Divider } from '@aws-amplify/ui-react'
import DropDownList from 'components/Atoms/Inputs/DropdownList'
import NewsLayout from './NewsLayout'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const Page = () => {
  return (
    <>
      <Button
        variant='text'
        onClick={() => {
          router.push('/')
        }}
      >
        &#8592; back
      </Button>
      <CenteredTitle title={'Latest News'} />
      <HorizontalDivider />
      <NewsLayout />
    </>
  )
}

export default Page

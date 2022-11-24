import React from 'react'
import { Button } from '@mui/material'
import router from 'next/router'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
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

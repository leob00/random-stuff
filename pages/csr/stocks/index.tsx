import { Button } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import StockSearchLayout from 'components/Organizms/stocks/StockSearchLayout'
import { useRouter } from 'next/router'
import React from 'react'

const Page = () => {
  const router = useRouter()
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
      <CenteredTitle title={'Stocks'} />
      <HorizontalDivider />
      <StockSearchLayout />
    </>
  )
}

export default Page
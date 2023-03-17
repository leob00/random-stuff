import { Button } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import StockSearchLayout from 'components/Organizms/stocks/StockSearchLayout'
import { useUserController } from 'hooks/userController'
import { useRouter } from 'next/router'
import React from 'react'

const Page = () => {
  const router = useRouter()
  const isLoggedIn = useUserController().isLoggedIn
  const backUrl = isLoggedIn ? '/protected/csr/dashboard' : ''
  return (
    <ResponsiveContainer>
      <Button
        variant='text'
        onClick={() => {
          router.push(backUrl)
        }}
      >
        &#8592; back
      </Button>
      <CenteredTitle title={'Stocks'} />
      <HorizontalDivider />
      <StockSearchLayout />
    </ResponsiveContainer>
  )
}

export default Page

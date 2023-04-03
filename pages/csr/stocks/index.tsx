import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import StockSearchLayout from 'components/Organizms/stocks/StockSearchLayout'
import { useUserController } from 'hooks/userController'
import { useRouter } from 'next/router'
import React from 'react'

const Page = () => {
  const router = useRouter()
  const isLoggedIn = useUserController().isLoggedIn
  const backUrl = isLoggedIn ? '/protected/csr/dashboard' : ''
  return (
    <>
      <Seo pageTitle='Stocks' />
      <ResponsiveContainer>
        <PageHeader text={'Stocks'} backButtonRoute={backUrl} />
        <StockSearchLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page

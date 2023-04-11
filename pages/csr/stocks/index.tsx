import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import StockSearchLayout from 'components/Organizms/stocks/StockSearchLayout'
import { useUserController } from 'hooks/userController'
import React from 'react'

const Page = () => {
  const ticket = useUserController().ticket
  const backUrl = ticket ? '/protected/csr/dashboard' : ''
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

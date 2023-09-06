import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import Seo from 'components/Organizms/Seo'
import React from 'react'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import RequireClaim from 'components/Organizms/user/RequireClaim'
import { useUserController } from 'hooks/userController'
import { constructDymamoPrimaryKey } from 'lib/backend/api/aws/util'
import StockPortfolioLayout from 'components/Organizms/stocks/portfolio/StockPortfolioLayout'

const Page = () => {
  // console.log('new profolioid: ', portfolioId)
  return (
    <>
      <Seo pageTitle='Stock Portfolios' />
      <BackButton />
      <ResponsiveContainer>
        <CenteredHeader title='Stock Portfolios' description='coming soon' />
        <RequireClaim claimType='rs'>
          <>
            <StockPortfolioLayout />
          </>
        </RequireClaim>
      </ResponsiveContainer>
    </>
  )
}

export default Page

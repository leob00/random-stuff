import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import BackButton from 'components/Atoms/Buttons/BackButton'
import Seo from 'components/Organizms/Seo'
import React from 'react'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import RequireClaim from 'components/Organizms/user/RequireClaim'
import StockPortfolioLayout from 'components/Organizms/stocks/portfolio/StockPortfolioLayout'

const Page = () => {
  return (
    <>
      <Seo pageTitle='Stock Portfolios' />
      <BackButton />
      <ResponsiveContainer>
        <CenteredHeader title='Stock Portfolios' />
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

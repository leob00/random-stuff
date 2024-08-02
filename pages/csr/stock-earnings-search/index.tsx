import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import StockEarningsSearchDisplay from 'components/Organizms/stocks/earnings/StockEarningsSearchDisplay'

const Page = () => {
  return (
    <>
      <Seo pageTitle='Stock Earnings Search' />
      <ResponsiveContainer>
        <PageHeader text='Earnings Search' backButtonRoute='/csr/my-stocks' />
        <StockEarningsSearchDisplay />
      </ResponsiveContainer>
    </>
  )
}

export default Page

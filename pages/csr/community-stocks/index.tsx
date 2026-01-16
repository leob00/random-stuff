import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import Seo from 'components/Organizms/Seo'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'
import StocksPageLayout from 'components/Organizms/stocks/StocksPageLayout'

const Page = () => {
  return (
    <>
      <Seo pageTitle={`Stocks`} />
      <ResponsiveContainer>
        <PageHeader text='Stocks'>
          <StockMarketPageContextMenu />
        </PageHeader>
        <StocksPageLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page

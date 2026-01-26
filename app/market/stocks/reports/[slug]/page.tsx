import PageHeader from 'components/Atoms/Containers/PageHeader'
import StockReportsPage from '../StockReportsPage'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <PageHeader text='Stock Reports'>
        <StockMarketPageContextMenu />
      </PageHeader>
      <StockReportsPage id={slug} />
    </>
  )
}

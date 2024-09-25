import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import CommoditiesLayout from 'components/Organizms/stocks/CommoditiesLayout'

const index = () => {
  return (
    <>
      <Seo pageTitle='My Stocks' />
      <ResponsiveContainer>
        <PageHeader text='Commodities' />
        <CommoditiesLayout />
      </ResponsiveContainer>
    </>
  )
}

export default index

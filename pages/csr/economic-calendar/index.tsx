import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import EconomyPageContextMenu from 'components/Molecules/Menus/EconomyPageContextMenu'
import Seo from 'components/Organizms/Seo'
import EconCalendarLayout from 'components/Organizms/stocks/EconCalendarLayout'

const Page = () => {
  return (
    <>
      <Seo pageTitle='Economic Calendar' />
      <ResponsiveContainer>
        <PageHeader text={'Economic Calendar'}>
          <EconomyPageContextMenu />
        </PageHeader>
        <EconCalendarLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page

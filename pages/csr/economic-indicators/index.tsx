import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import EconomyPageContextMenu from 'components/Molecules/Menus/EconomyPageContextMenu'
import EconDataLayout from 'components/Organizms/econ/EconDataLayout'
import Seo from 'components/Organizms/Seo'

const Page = () => {
  return (
    <>
      <Seo pageTitle='Economic Indicators' />
      <ResponsiveContainer>
        <PageHeader text={'Economic Indicators'}>
          <EconomyPageContextMenu />
        </PageHeader>
        <EconDataLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page

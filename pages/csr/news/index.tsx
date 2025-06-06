import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import NewsLayoutWrapper from 'components/Organizms/news/NewsLayoutWrapper'

const Page = () => {
  return (
    <>
      <Seo pageTitle={`News`} />
      <ResponsiveContainer>
        <PageHeader text='News' />
        <NewsLayoutWrapper />
      </ResponsiveContainer>
    </>
  )
}

export default Page

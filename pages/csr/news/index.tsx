import React from 'react'
import NewsLayout from 'components/Organizms/news/NewsLayout'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'

const Page = () => {
  return (
    <>
      <Seo pageTitle={`News`} />
      <ResponsiveContainer>
        <PageHeader text='News' backButtonRoute='/' />
        <NewsLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page

import React from 'react'
import NewsLayout from 'components/Organizms/news/NewsLayout'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import { useUserController } from 'hooks/userController'

const Page = () => {
  const ticket = useUserController().ticket
  return (
    <>
      <Seo pageTitle={`News`} />
      <ResponsiveContainer>
        <PageHeader text='News' />
        <NewsLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page

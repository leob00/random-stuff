import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import EconCalendarLayout from 'components/Organizms/stocks/EconCalendarLayout'
import React from 'react'

const Page = () => {
  return (
    <>
      <Seo pageTitle='Economic Calendar' />
      <ResponsiveContainer>
        <PageHeader text={'Economic Calendar'} />
        <EconCalendarLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page

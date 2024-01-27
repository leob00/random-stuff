import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import EconCalendarLayout from 'components/Organizms/stocks/EconCalendarLayout'
import EconDataLayout from 'components/Organizms/stocks/EconDataLayout'
import React from 'react'

const Page = () => {
  return (
    <>
      <Seo pageTitle='Economic Data' />
      <ResponsiveContainer>
        <PageHeader text={'Economic Data'} />
        <EconDataLayout />
      </ResponsiveContainer>
    </>
  )
}

export default Page

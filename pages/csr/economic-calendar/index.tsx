import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import EconCalendarLayout from 'components/Organizms/stocks/EconCalendarLayout'
import React from 'react'

const index = () => {
  return (
    <>
      <Seo pageTitle='Stocks' />
      <ResponsiveContainer>
        <PageHeader text={'Economic Calendar'} />
        <EconCalendarLayout />
      </ResponsiveContainer>
    </>
  )
}

export default index

import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import RequireUserProfile from 'components/Organizms/user/RequireUserProfile'
import UserGoalsLayout from 'components/Organizms/user/goals/UserGoalsLayout'
import React from 'react'

const Page = () => {
  return (
    <>
      <Seo pageTitle='Goals' />
      <ResponsiveContainer>
        <PageHeader text={'Goals'} />
        <RequireUserProfile>
          <UserGoalsLayout />
        </RequireUserProfile>
      </ResponsiveContainer>
    </>
  )
}

export default Page

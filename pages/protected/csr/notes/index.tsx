import UserNotesLayout from 'components/Organizms/user/UserNotesLayout'
import React from 'react'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import Seo from 'components/Organizms/Seo'
import RequireUserProfile from 'components/Organizms/user/RequireUserProfile'

const Notes = () => {
  return (
    <>
      <Seo pageTitle='Notes' />
      <ResponsiveContainer>
        <RequireUserProfile>
          <UserNotesLayout />
        </RequireUserProfile>
      </ResponsiveContainer>
    </>
  )
}

export default Notes

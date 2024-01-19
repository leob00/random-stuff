import { Box } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { getRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import { getUserSSR } from 'lib/backend/server-side/serverSideAuth'
import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import SendPinLayout from 'components/Organizms/user/profile/SendPinLayout'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'

interface PageProps {
  ticket: AmplifyUser | null
  profile: UserProfile | null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let ticket: AmplifyUser | null
  let profile: UserProfile | null = null
  ticket = await getUserSSR(context)
  if (ticket) {
    const key = constructUserProfileKey(ticket.email)
    profile = await getRandomStuff(key)
  }

  return {
    props: {
      ticket: ticket,
      profile: profile,
    },
  }
}

const Page: NextPage<PageProps> = ({ ticket, profile }) => {
  return (
    <ResponsiveContainer>
      {ticket && profile ? (
        <SendPinLayout ticket={ticket} profile={profile} />
      ) : (
        <Box>
          <PleaseLogin />
        </Box>
      )}
    </ResponsiveContainer>
  )
}

export default Page

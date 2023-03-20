import { Box, Button, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { EmailMessage, getRandomStuff, sendEmail, UserProfile } from 'lib/backend/api/aws/apiGateway'
import { constructUserProfileKey } from 'lib/backend/api/aws/util'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import { getRecord, sendEmailFromClient } from 'lib/backend/csr/nextApiWrapper'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import { getUserSSR } from 'lib/backend/server-side/serverSideAuth'
import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import router from 'next/router'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import InternalLink from 'components/Atoms/Buttons/InternalLink'

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

const Result = (ticket: AmplifyUser, profile: UserProfile, targetRoute: string) => {
  const [emailSent, setEmailSent] = React.useState(false)
  const handleSendPinEmail = async () => {
    const encKey = `${profile.id}${profile.username}`
    const decryptedPin = myDecrypt(encKey, profile.pin!.pin)
    const message: EmailMessage = {
      to: profile.username,
      subject: 'your pin',
      html: `<html><p>Your requested pin:</p><h3>${decryptedPin}</h3></html>`,
    }
    await sendEmailFromClient(message)
    setEmailSent(true)
  }
  return (
    <Box py={2}>
      <CenteredHeader title={'Recover pin'} />
      <HorizontalDivider />
      <Box py={2}>
        {!emailSent ? (
          <>
            <Box py={2}>
              <Typography>
                {`We can send your your pin via email. The sender address will appear as 'alertsender@quotelookup.net' Please be sure to check your spam folders
                if you don't find the email in your inbox.`}
              </Typography>
            </Box>
            <CenterStack>
              <Button variant='contained' disabled={emailSent} onClick={handleSendPinEmail}>
                Send
              </Button>
            </CenterStack>
          </>
        ) : (
          <>
            <Box py={2}>
              <CenterStack>
                <Typography>Email sent! Please be sure to check your spam folder if you annot find the email in your inbox.</Typography>
              </CenterStack>
            </Box>
            <CenterStack>
              <InternalLink route={targetRoute} text={'enter pin'} />
            </CenterStack>
          </>
        )}
      </Box>
    </Box>
  )
}

const Page: NextPage<PageProps> = ({ ticket, profile }) => {
  const { id } = router.query
  return (
    <ResponsiveContainer>
      {ticket && profile ? (
        Result(ticket, profile, String(id))
      ) : (
        <Box>
          <PleaseLogin />
        </Box>
      )}
    </ResponsiveContainer>
  )
}

export default Page

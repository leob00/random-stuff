import { Box, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { sendEmailFromClient } from 'lib/backend/csr/nextApiWrapper'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import React from 'react'
import { useRouter } from 'next/router'
import { formatEmail } from 'lib/ui/mailUtil'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { EmailMessage } from 'app/serverActions/aws/ses/ses'

const SendPinLayout = ({ profile }: { profile: UserProfile }) => {
  const [emailSent, setEmailSent] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  const { id } = router.query

  const handleSendPinEmail = async () => {
    setIsLoading(true)
    const encKey = `${profile.id}${profile.username}`
    const decryptedPin = myDecrypt(encKey, profile.pin!.pin)
    const replaceValues = new Map<string, string>()
    const siteUrl = `${document.location.protocol.toString()}//${document.location.host}/`

    replaceValues.set('pin', decryptedPin)
    replaceValues.set('siteUrl', siteUrl)

    const html = await formatEmail('/emailTemplates/sendPin.html', replaceValues)
    const message: EmailMessage = {
      from: 'alertsender@quotelookup.net',
      to: profile.username,
      subject: 'your pin',
      html: html,
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
              <Typography textAlign={'center'}>
                {`We can send your your pin via email. The sender address will appear as 'alertsender@quotelookup.net'. Please be sure to check your spam folders
                if you don't find the email in your inbox.`}
              </Typography>
            </Box>
            <CenterStack>
              <PrimaryButton text={isLoading ? 'sending...' : 'Send'} disabled={isLoading} onClick={handleSendPinEmail} />
            </CenterStack>
          </>
        ) : (
          <>
            <Box py={2}>
              <CenterStack>
                <Typography>Email sent! Please be sure to check your spam folder if you cannot find the email in your inbox.</Typography>
              </CenterStack>
            </Box>
            <CenterStack>
              <InternalLink route={String(id)} text={'enter pin'} />
            </CenterStack>
          </>
        )}
      </Box>
    </Box>
  )
}

export default SendPinLayout

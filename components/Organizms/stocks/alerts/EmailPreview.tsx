import { Box, Card, CardContent, Typography } from '@mui/material'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { EmailMessage } from 'lib/backend/api/aws/apiGateway'
import React from 'react'

const EmailPreview = ({ emailMessage, onClose, onSend }: { emailMessage: EmailMessage; onClose: () => void; onSend: () => void }) => {
  return (
    <Box pb={6}>
      <HorizontalDivider />
      <Box pt={2}>
        <CenterStack>
          <Box display={'flex'} gap={2}>
            <PrimaryButton text='send' size='small' onClick={onSend} />
            <SecondaryButton text='close' size='small' onClick={onClose} />
          </Box>
        </CenterStack>
      </Box>
      <Typography variant={'h4'} textAlign='center' pt={4}>
        email preview
      </Typography>
      <CenterStack sx={{ py: 2 }}>
        <ReadOnlyField label='to' val={emailMessage.to} />
      </CenterStack>
      <CenterStack>
        <ReadOnlyField label='subject' val={emailMessage.subject} />
      </CenterStack>

      <CenterStack>
        <HtmlView html={emailMessage.html} />
      </CenterStack>
      <Box pt={2}>
        <CenterStack>
          <Box display={'flex'} gap={2}>
            <PrimaryButton text='send' size='small' onClick={onSend} />
            <SecondaryButton text='close' size='small' onClick={onClose} />
          </Box>
        </CenterStack>
      </Box>
    </Box>
  )
}

export default EmailPreview

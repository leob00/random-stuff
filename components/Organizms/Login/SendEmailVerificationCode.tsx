import { Box, Typography } from '@mui/material'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { VeryLightBlue } from 'components/themes/mainTheme'
import { sendEmailVerificationCode } from 'lib/backend/auth/userUtil'
import { useState } from 'react'

const SendEmailVerificationCode = ({ onSent }: { onSent: () => void }) => {
  const [isLoading, setIsLoading] = useState(false)
  const handleSendVerificationConde = async () => {
    setIsLoading(true)
    const result = await sendEmailVerificationCode()
    if (result) {
      onSent()
    }
    setIsLoading(false)
  }
  return (
    <Box py={2} border={`solid 1px ${VeryLightBlue}`} borderRadius={'16px'} minHeight={500}>
      {isLoading && <BackdropLoader />}
      <Box py={2} px={4}>
        <Typography
          textAlign={'center'}
        >{`We need to verify that it is really you. Please click 'send' and check your email for your temporary validation code.`}</Typography>
      </Box>
      <CenterStack sx={{ py: 4 }}>
        <SuccessButton text='send' disabled={isLoading} onClick={handleSendVerificationConde} />
      </CenterStack>
    </Box>
  )
}

export default SendEmailVerificationCode

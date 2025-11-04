'use client'

import { Box } from '@mui/material'
import UserResetPasswordForm from 'components/account/UserResetPasswordForm'
import SendEmailVerificationCode from 'components/Organizms/Login/SendEmailVerificationCode'
import VerifyVerificationCode from 'components/Organizms/Login/verify/VerifyVerificationCode'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { useState } from 'react'

const ResetPasswordLayout = ({ userProfile, onSuccess, onCancel }: { userProfile: UserProfile; onSuccess: () => void; onCancel: () => void }) => {
  const [showVerifyCode, setShowVerifyCode] = useState(false)
  const handleSent = () => {
    setShowVerifyCode(true)
  }
  const handleCodeVerified = (code?: string) => {
    setShowVerifyCode(false)
    //onCodeVerified(code)
  }

  return (
    <Box py={2}>
      <Box>
        {!showVerifyCode && <SendEmailVerificationCode onSent={handleSent} onCancel={onCancel} passwordReset />}
        {/* {showVerifyCode && !verificationCode && <VerifyVerificationCode onSuccess={handleCodeVerified}  />} */}
      </Box>
      {showVerifyCode && (
        <Box>
          <UserResetPasswordForm onSuccess={onSuccess} onCancel={onCancel} />
        </Box>
      )}
    </Box>
  )
}

export default ResetPasswordLayout

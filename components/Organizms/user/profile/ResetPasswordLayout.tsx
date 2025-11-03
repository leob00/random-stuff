'use client'

import { Box } from '@mui/material'
import UserResetPasswordForm from 'components/account/UserResetPasswordForm'
import SendEmailVerificationCode from 'components/Organizms/Login/SendEmailVerificationCode'
import VerifyVerificationCode from 'components/Organizms/Login/verify/VerifyVerificationCode'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { useState } from 'react'

const ResetPasswordLayout = ({
  userProfile,
  onSuccess,
  onCodeVerified,
}: {
  userProfile: UserProfile
  onSuccess: () => void
  onCodeVerified: (code?: string) => void
}) => {
  const [showVerifyCode, setShowVerifyCode] = useState(false)
  const [verificationCode, setVerificationCode] = useState<string | null>(null)
  const handleSent = () => {
    setShowVerifyCode(true)
  }
  const handleCodeVerified = (code?: string) => {
    setShowVerifyCode(false)
    setVerificationCode(code ?? null)
    //onCodeVerified(code)
  }

  const handleSuccess = () => {}

  return (
    <Box py={2}>
      <Box>
        {!showVerifyCode && !verificationCode && <SendEmailVerificationCode onSent={handleSent} onCancel={() => {}} />}
        {showVerifyCode && !verificationCode && <VerifyVerificationCode onSuccess={handleCodeVerified} />}
      </Box>
      {verificationCode && !showVerifyCode && (
        <Box>
          <UserResetPasswordForm verificationCode={verificationCode} onSuccess={handleSuccess} />
        </Box>
      )}
    </Box>
  )
}

export default ResetPasswordLayout

import { Box } from '@mui/material'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import SendEmailVerificationCode from './SendEmailVerificationCode'
import { useState } from 'react'
import VerifyVerificationCode from './verify/VerifyVerificationCode'

const ValidateFromEmailDialog = ({ show, onSuccess, onClose }: { show: boolean; onSuccess: (code?: string) => void; onClose: () => void }) => {
  const [showVerifyCode, setShowVerifyCode] = useState(false)
  const handleSent = () => {
    setShowVerifyCode(true)
  }
  const handleSuccess = (code?: string) => {
    setShowVerifyCode(false)
    onSuccess(code)
  }

  return (
    <Box>
      <InfoDialog show={show} title='Email verification' fullScreen={true} onCancel={onClose}>
        {!showVerifyCode && <SendEmailVerificationCode onSent={handleSent} onCancel={onClose} />}
        {showVerifyCode && <VerifyVerificationCode onSuccess={handleSuccess} />}
      </InfoDialog>
    </Box>
  )
}

export default ValidateFromEmailDialog

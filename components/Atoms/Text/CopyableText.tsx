import React from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box, IconButton, Typography } from '@mui/material'
import SnackbarSuccess from '../Dialogs/SnackbarSuccess'

const CopyableText = ({ label, value, showValue = false }: { label: string; value: string; showValue?: boolean }) => {
  const [showCopyConfirm, setShowCopyConfirm] = React.useState(false)

  const handleCopyItem = (item: string) => {
    navigator.clipboard.writeText(item)
    setShowCopyConfirm(true)
  }

  React.useEffect(() => {
    if (showCopyConfirm) {
      setTimeout(() => {
        setShowCopyConfirm(false)
      }, 2000)
    }
  }, [showCopyConfirm])
  return (
    <>
      <Typography pr={2}>{`${label}`}</Typography>
      {showValue && <Typography pr={2}>{`${value}`}</Typography>}
      <IconButton size='small' onClick={() => handleCopyItem(value)}>
        <ContentCopyIcon fontSize='small' />
      </IconButton>
      {showCopyConfirm && <SnackbarSuccess show={true} text={'copied!'} />}
    </>
  )
}

export default CopyableText

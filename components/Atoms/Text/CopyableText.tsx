import React from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box, IconButton, Typography, useTheme } from '@mui/material'
import SnackbarSuccess from '../Dialogs/SnackbarSuccess'
import ReadOnlyField from './ReadOnlyField'

const CopyableText = ({ label, value, showValue = false }: { label: string; value: string; showValue?: boolean }) => {
  const [showCopyConfirm, setShowCopyConfirm] = React.useState(false)
  const theme = useTheme()
  const textColor = theme.palette.primary.main
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
      <Typography pr={2} color={textColor}>{`${label}`}</Typography>
      {showValue && <Typography pr={2} color={textColor}>{`${value}`}</Typography>}
      <IconButton size='small' onClick={() => handleCopyItem(value)}>
        <ContentCopyIcon fontSize='small' color='primary' />
      </IconButton>
      {showCopyConfirm && <SnackbarSuccess show={true} text={'copied!'} />}
    </>
  )
}

export default CopyableText

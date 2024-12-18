import React from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box, IconButton, Typography, TypographyOwnProps, TypographyPropsVariantOverrides, useTheme } from '@mui/material'
import SnackbarSuccess from '../Dialogs/SnackbarSuccess'
import ReadOnlyField from './ReadOnlyField'
import { Variant } from '@mui/material/styles/createTypography'

const CopyableText = ({ label, value, showValue = false, variant = 'body1' }: { label: string; value: string; showValue?: boolean; variant?: Variant }) => {
  const [showCopyConfirm, setShowCopyConfirm] = React.useState(false)
  const theme = useTheme()
  const textColor = theme.palette.primary.main
  const handleCopyItem = (item: string) => {
    navigator.clipboard.writeText(item)
    setShowCopyConfirm(true)
  }

  return (
    <>
      <Box display={'flex'} alignContent={'center'}>
        <Box>
          <Typography variant={variant} pr={2} color={textColor}>{`${label}`}</Typography>
        </Box>
        {showValue && (
          <Box>
            <Typography variant={variant} pr={2} color={textColor}>{`${value}`}</Typography>
          </Box>
        )}
        <IconButton size='small' onClick={() => handleCopyItem(value)}>
          <ContentCopyIcon fontSize='small' color='primary' />
        </IconButton>
      </Box>
      {showCopyConfirm && <SnackbarSuccess show={showCopyConfirm} text={'copied!'} onClose={() => setShowCopyConfirm(false)} />}
    </>
  )
}

export default CopyableText

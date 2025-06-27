import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box, IconButton, Typography, TypographyOwnProps, TypographyPropsVariantOverrides, useTheme } from '@mui/material'
import SnackbarSuccess from '../Dialogs/SnackbarSuccess'
import { TypographyVariant } from '@mui/material/styles/createTypography'
import { useState } from 'react'

const CopyableText = ({
  label,
  value,
  showValue = false,
  variant = 'body1',
  labelColor,
}: {
  label: string
  value: string
  showValue?: boolean
  variant?: TypographyVariant
  labelColor?: TypographyOwnProps['color']
}) => {
  const [showCopyConfirm, setShowCopyConfirm] = useState(false)
  const theme = useTheme()
  const textColor = theme.palette.primary.main
  const handleCopyItem = (item: string) => {
    navigator.clipboard.writeText(item)
    setShowCopyConfirm(true)
  }

  return (
    <>
      <Box display={'flex'} alignItems={'flex-start'}>
        {label && (
          <Box>
            <Typography variant={variant} pr={2} color={labelColor ?? textColor}>{`${label}`}</Typography>
          </Box>
        )}
        {showValue && (
          <Box>
            <Typography variant={variant} pr={2} color={labelColor ?? textColor}>{`${value}`}</Typography>
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

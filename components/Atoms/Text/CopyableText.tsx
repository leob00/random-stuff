import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Box, IconButton, Typography, TypographyOwnProps, TypographyPropsVariantOverrides, useTheme } from '@mui/material'
import SnackbarSuccess from '../Dialogs/SnackbarSuccess'
import { TypographyVariant } from '@mui/material/styles/createTypography'
import { useState } from 'react'
import MarkdownView from './MarkdownView'

const CopyableText = ({
  label,
  value,
  showValue = false,
  variant = 'body1',
  labelColor,
  isMarkdown,
}: {
  label: string
  value: string
  showValue?: boolean
  variant?: TypographyVariant
  labelColor?: TypographyOwnProps['color']
  isMarkdown?: boolean
}) => {
  const [showCopyConfirm, setShowCopyConfirm] = useState(false)
  const theme = useTheme()
  const handleCopyItem = (item: string) => {
    navigator.clipboard.writeText(item)
    setShowCopyConfirm(true)
  }

  return (
    <>
      <Box display={'flex'} alignItems={'flex-start'}>
        {label && (
          <Box>
            <Typography color='secondary' variant={variant} pr={2}>{`${label}`}</Typography>
          </Box>
        )}
        {showValue && (
          <Box>{isMarkdown ? <MarkdownView text={value} /> : <Typography variant={variant} pr={2} color={labelColor ?? 'info'}>{`${value}`}</Typography>}</Box>
        )}
        <IconButton color='info' size='small' onClick={() => handleCopyItem(value)}>
          <ContentCopyIcon fontSize='small' color='info' />
        </IconButton>
      </Box>
      {showCopyConfirm && <SnackbarSuccess show={showCopyConfirm} text={'copied!'} onClose={() => setShowCopyConfirm(false)} />}
    </>
  )
}

export default CopyableText

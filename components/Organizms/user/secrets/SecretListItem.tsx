import Create from '@mui/icons-material/Create'
import { Box, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { myDecrypt } from 'lib/backend/encryption/useEncryptor'
import React, { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import { UserSecret } from 'lib/backend/api/models/zModels'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const SecretListItem = ({ encKey, data, onEdit }: { encKey: string; data: UserSecret; onEdit: () => void }) => {
  const [isEncrypted, setIsEncrypted] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const handleDecryptCopy = () => {
    let val = { ...data }.secret
    if (isEncrypted) {
      val = myDecrypt(encKey, data.secret)
    }
    navigator.clipboard.writeText(val)
    setIsEncrypted(!isEncrypted)
    setIsCopied(true)
  }

  const handleEditClick = () => {
    setIsEditMode(true)
    onEdit()
  }

  return (
    <Box>
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Typography>{data.title}</Typography>
        </Box>
        <Box display={'flex'} gap={2}>
          <IconButton edge='end' onClick={handleDecryptCopy} size='small' color='primary'>
            <ContentCopyIcon fontSize='small' />
          </IconButton>
          <IconButton onClick={handleEditClick} color='primary' size='small'>
            <Create />
          </IconButton>
        </Box>
      </Box>
      <HorizontalDivider />
      {isCopied && <SnackbarSuccess show={isCopied} text={'copied!'} duration={2500} onClose={() => setIsCopied(false)} />}
    </Box>
  )
}

export default SecretListItem

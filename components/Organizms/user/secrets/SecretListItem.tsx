import Create from '@mui/icons-material/Create'
import { Box, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import { UserSecret } from 'lib/backend/api/models/zModels'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { decryptUserSecret } from 'lib/backend/csr/nextApiWrapper'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const SecretListItem = ({ data, onEdit }: { data: UserSecret; onEdit: () => void }) => {
  const [isEncrypted, setIsEncrypted] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDecryptCopy = async () => {
    let val = { ...data }.secret
    if (isEncrypted) {
      setIsLoading(true)
      const result = await decryptUserSecret(data)
      val = result.secret
    }
    setIsLoading(false)

    navigator.clipboard.writeText(val)
    setIsEncrypted(!isEncrypted)
    setIsCopied(true)
  }

  const handleEditClick = () => {
    onEdit()
  }

  return (
    <Box>
      {isLoading && <ComponentLoader />}
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

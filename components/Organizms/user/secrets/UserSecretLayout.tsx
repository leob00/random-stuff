import { TextField } from '@aws-amplify/ui-react'
import { Box, Stack, Typography } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import { UserSecret } from 'lib/backend/api/models/zModels'
import { myDecrypt, myEncrypt } from 'lib/backend/encryption/useEncryptor'
import React from 'react'

const UserSecretLayout = ({ data, encKey }: { data: UserSecret; encKey: string }) => {
  const [isEncrypted, setIsEncrypted] = React.useState(true)
  const [userSecret, setUserSecret] = React.useState(data)
  const [decryptedValue, setDecryptedValue] = React.useState<string>('')

  const handleDecrypt = () => {
    setIsEncrypted(false)

    const decrypted = myDecrypt(encKey, userSecret.secret)
    console.log(decrypted)
    setDecryptedValue(decrypted)
  }
  const handleEncrypt = () => {
    const encrypted = myEncrypt(encKey, decryptedValue)
    setDecryptedValue('')
    setUserSecret({ ...userSecret, secret: encrypted })
    console.log(encrypted)
    setIsEncrypted(true)
  }

  return (
    <Box>
      {isEncrypted ? (
        <>
          <Stack>
            <TextField size='small' label={''} width={'85%'} defaultValue={`${userSecret.secret}`} readOnly></TextField>
          </Stack>
          <Box py={2}>
            <SecondaryButton size='small' text={'decrypt'} onClick={handleDecrypt} />
          </Box>
        </>
      ) : (
        <>
          <Stack>
            <TextField size='small' label={''} width={'85%'} defaultValue={`${decryptedValue}`} readOnly></TextField>
          </Stack>
          <Box py={2}>
            <SecondaryButton size='small' text={'encrypt'} onClick={handleEncrypt} />
          </Box>
        </>
      )}
    </Box>
  )
}

export default UserSecretLayout

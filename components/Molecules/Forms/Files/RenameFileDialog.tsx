import { Alert, Box, Link, Stack, TextField, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import React from 'react'

const RenameFileDialog = ({ filename, onCancel, onSubmitted }: { filename: string; onCancel: () => void; onSubmitted: (newfilename: string) => void }) => {
  const [userFilename, setUserFilename] = React.useState(filename.substring(0, filename.lastIndexOf('.')))

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newFileName = `${userFilename}${filename.substring(filename.lastIndexOf('.'))}`
    onSubmitted(newFileName)
  }
  return (
    <FormDialog title='View file' show={true} onCancel={onCancel}>
      <>
        <Stack>
          <CenterStack>
            <Typography textAlign={'center'}>{filename}</Typography>
          </CenterStack>
        </Stack>
        <form method='post' onSubmit={handleSubmit}>
          <Box display={'flex'} gap={1} pt={2} alignItems={'center'}>
            <Typography>new name:</Typography>
            <TextField
              required
              name='userFilename'
              variant='outlined'
              size='small'
              value={userFilename}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setUserFilename(event.target.value)
              }}></TextField>
            <Typography>{filename.substring(filename.lastIndexOf('.'))}</Typography>
          </Box>
          <CenterStack sx={{ pt: 2 }}>
            <PrimaryButton type='submit' text={'submit'}></PrimaryButton>
          </CenterStack>
        </form>
      </>
    </FormDialog>
  )
}

export default RenameFileDialog

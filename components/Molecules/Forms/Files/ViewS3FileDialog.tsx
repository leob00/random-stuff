import { Alert, Box, Link, Stack, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import React from 'react'

const ViewS3FileDialog = ({ signedUrl, filename, onCancel }: { signedUrl: string; filename: string; onCancel: () => void }) => {
  const signedUrlRef = React.useRef<HTMLAnchorElement | null>(null)
  const previewImageExtenstions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg']
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase()
  const isAudio = ext.includes('.mp3')
  const isImage = previewImageExtenstions.includes(ext)
  return (
    <FormDialog title='View file' show={true} onCancel={onCancel}>
      <>
        <Stack>
          <Box py={2}>
            <Alert color='success'>
              <Typography variant='caption' textAlign={'center'}>
                This secure link will expire in a few minutes.
              </Typography>
            </Alert>
          </Box>
        </Stack>
        {isAudio && (
          <CenterStack sx={{ pt: 2 }}>
            <Box>
              <audio controls>
                <source src={signedUrl} type='audio/ogg' />
                Your browser does not support the audio element.
              </audio>
            </Box>{' '}
          </CenterStack>
        )}
        {isImage && (
          <CenterStack sx={{ pt: 2 }}>
            <Box width={250}>
              <img width={250} src={signedUrl} alt='preview image' />
            </Box>
          </CenterStack>
        )}

        <CenterStack sx={{ py: 2 }}>
          <Link rel='noreferrer' ref={signedUrlRef} href={signedUrl} target={'_blank'}>
            <PrimaryButton text={'download file'} onClick={onCancel}></PrimaryButton>
          </Link>
        </CenterStack>
      </>
    </FormDialog>
  )
}

export default ViewS3FileDialog

import { Alert, Box, Link, Stack, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import React from 'react'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'

const ViewS3FileDialog = ({ signedUrl, filename, onCancel }: { signedUrl: string; filename: string; onCancel: () => void }) => {
  const signedUrlRef = React.useRef<HTMLAnchorElement | null>(null)
  const previewImageExtenstions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp']
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase()
  const isAudio = ext.includes('.mp3')
  const isImage = previewImageExtenstions.includes(ext)
  return (
    <FormDialog title='View file' show={true} onCancel={onCancel} fullScreen>
      <>
        <Stack>
          <Stack py={2} flexDirection={'row'} justifyContent={'center'}>
            <Alert color='success'>
              <Typography variant='caption' textAlign={'center'}>
                This secure link will expire in a few minutes.
              </Typography>
            </Alert>
          </Stack>
        </Stack>
        <CenterStack sx={{ py: 2 }}>{filename}</CenterStack>
        <CenterStack sx={{ py: 2 }}>
          <Link rel='noreferrer' ref={signedUrlRef} href={signedUrl} target={'_blank'}>
            <PrimaryButton text={'download file'} onClick={onCancel} startIcon={<CloudDownloadIcon />} />
          </Link>
        </CenterStack>
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
            <Stack width={{ xs: 275, md: 600 }}>
              <img style={{ maxWidth: '100%', borderRadius: '12px' }} src={signedUrl} alt='preview image' />
            </Stack>
          </CenterStack>
        )}
      </>
    </FormDialog>
  )
}

export default ViewS3FileDialog

import { Alert, Box, Link, Stack, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import React from 'react'

const ViewS3FileDialog = ({ signedUrl, filename, onCancel }: { signedUrl: string; filename: string; onCancel: () => void }) => {
  const signedUrlRef = React.useRef<HTMLAnchorElement | null>(null)
  const isAudio = filename.includes('.mp3')
  return (
    <FormDialog title='View file' show={true} onCancel={onCancel}>
      <>
        <Stack>
          <Box py={2}>
            <Alert color='warning'>
              <Typography variant='caption' textAlign={'center'}>
                This secure link will expire in a few minutes.
              </Typography>
            </Alert>
          </Box>
          <CenterStack>
            <Typography textAlign={'center'}>{filename}</Typography>
          </CenterStack>
        </Stack>
        <CenterStack sx={{ pt: 2 }}>
          {isAudio && (
            <>
              <audio controls>
                <source src={signedUrl} type='audio/ogg' />
                Your browser does not support the audio element.
              </audio>
            </>
          )}
          {!isAudio && (
            <Link rel='noreferrer' ref={signedUrlRef} href={signedUrl} target={'_blank'}>
              <PrimaryButton text={'view file'} onClick={onCancel}></PrimaryButton>
            </Link>
          )}
        </CenterStack>
      </>
    </FormDialog>
  )
}

export default ViewS3FileDialog

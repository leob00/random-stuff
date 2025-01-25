import { Box, Link } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import { useRef } from 'react'
import AudioPlayer from 'components/Atoms/Media/AudioPlayer'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ImagePreview from 'components/Atoms/Images/ImagePreview'

const ViewS3FileDialog = ({ signedUrl, filename, onCancel }: { signedUrl: string; filename: string; onCancel: () => void }) => {
  const signedUrlRef = useRef<HTMLAnchorElement | null>(null)
  const previewImageExtenstions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp']
  const previewVideoExtenstions = ['.mpeg']
  const previewAudioExtenstions = ['.mp3', 'mp4', '.m4a']
  const previewTextExtenstions = ['.txt', '.csv', '.json', '.html']
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase()
  const isVideo = previewVideoExtenstions.includes(ext)
  const isAudio = previewAudioExtenstions.includes(ext)
  const isImage = previewImageExtenstions.includes(ext)
  const isPdf = ext.includes('.pdf')
  return (
    <FormDialog title='View file' show={true} onCancel={onCancel} fullScreen>
      <>
        <CenterStack sx={{ py: 2 }}>{filename}</CenterStack>
        <HorizontalDivider />
        {isAudio && (
          <CenterStack sx={{ pt: 2 }}>
            <Box>
              <AudioPlayer source={signedUrl} />
            </Box>
          </CenterStack>
        )}
        {isVideo && (
          <CenterStack sx={{ pt: 2 }}>
            <Box>
              <video controls width='250'>
                <source src={signedUrl} type='video/webm' />
                Your browser does not support the video element.
              </video>
            </Box>{' '}
          </CenterStack>
        )}
        {isImage && <ImagePreview url={signedUrl} />}
        {isPdf && (
          <CenterStack sx={{ pt: 2 }}>
            <iframe style={{ border: 'none' }} src={signedUrl} width={275} height={500} />
          </CenterStack>
        )}
      </>

      <CenterStack sx={{ py: 8 }}>
        <Link rel='noreferrer' ref={signedUrlRef} href={signedUrl} target={'_blank'}>
          <PrimaryButton text={'download file'} onClick={onCancel} startIcon={<CloudDownloadIcon />} />
        </Link>
      </CenterStack>
    </FormDialog>
  )
}

export default ViewS3FileDialog

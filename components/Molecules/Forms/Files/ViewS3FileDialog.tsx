import { Box, Link } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import { useRef } from 'react'
import AudioPlayer from 'components/Atoms/Media/AudioPlayer'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ImagePreview from 'components/Atoms/Images/ImagePreview'
import PdfViewer from './PdfViewer'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import JsonPreview from './JsonPreview'
import TextPreview from './TextPreview'

const ViewS3FileDialog = ({ signedUrl, filename, onCancel }: { signedUrl: string; filename: string; onCancel: () => void }) => {
  const signedUrlRef = useRef<HTMLAnchorElement | null>(null)
  const previewImageExtenstions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp']
  const previewVideoExtenstions = ['.mpeg']
  const previewAudioExtenstions = ['.mp3', 'mp4', '.m4a']
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase()
  const isVideo = previewVideoExtenstions.includes(ext)
  const isAudio = previewAudioExtenstions.includes(ext)
  const isImage = previewImageExtenstions.includes(ext)
  const isPdf = ext.includes('.pdf')
  const isText = ext.includes('.txt') || ext.includes('.csv')
  const isJson = ext.includes('.json')
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
        {isPdf && <PdfViewer url={signedUrl} />}
        {isJson && <JsonPreview url={signedUrl} />}
        {isText && <TextPreview url={signedUrl} />}
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

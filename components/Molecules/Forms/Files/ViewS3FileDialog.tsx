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
import JsonPreview from './JsonPreview'
import TextPreview from './TextPreview'
import CsvPreview from './CsvPreview'
import { S3Object } from 'lib/backend/api/aws/models/apiGatewayModels'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { getFileSizeText } from 'lib/util/numberUtil'

const ViewS3FileDialog = ({ signedUrl, s3Object, onCancel }: { signedUrl: string; s3Object: S3Object; onCancel: () => void }) => {
  const signedUrlRef = useRef<HTMLAnchorElement | null>(null)
  const previewImageExtenstions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.webp']
  const previewVideoExtenstions = ['.mpeg']
  const previewAudioExtenstions = ['.mp3', 'mp4', '.m4a']
  const ext = s3Object.filename.substring(s3Object.filename.lastIndexOf('.')).toLowerCase()
  const isVideo = previewVideoExtenstions.includes(ext)
  const isAudio = previewAudioExtenstions.includes(ext)
  const isImage = previewImageExtenstions.includes(ext)
  const isPdf = ext.includes('.pdf')
  const isText = ext.includes('.txt')
  const isCsv = ext.includes('.csv')
  const isZip = ext.includes('.zip')

  const isJson = ext.includes('.json')
  return (
    <FormDialog title='View file' show={true} onCancel={onCancel} fullScreen>
      <>
        <CenterStack sx={{ py: 2 }}>{s3Object.filename}</CenterStack>
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
        {isCsv && <CsvPreview url={signedUrl} />}
        {isZip && (
          <CenterStack sx={{ pt: 2 }}>
            <ReadOnlyField label='size' val={getFileSizeText(s3Object.size!)} />
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

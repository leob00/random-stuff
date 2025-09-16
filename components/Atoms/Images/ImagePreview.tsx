import { Box } from '@mui/material'
import { ImageSize } from 'lib/backend/files/fileTypes'
import CenterStack from '../CenterStack'
import OptimizedImage from './OptimizedImage'
import TextExtractor from 'components/Organizms/files/TextExtractor'

const ImagePreview = ({ url, imageSize, hideTextExtract = false }: { url: string; imageSize?: ImageSize; hideTextExtract?: boolean }) => {
  return (
    <Box>
      <CenterStack>
        <Box sx={{ borderRadius: '16px', paddingTop: '4px' }}>
          <OptimizedImage url={url} title='' imageSize={imageSize} />
        </Box>
      </CenterStack>
      {!hideTextExtract && (
        <Box>
          <TextExtractor url={url} />
        </Box>
      )}
    </Box>
  )
}

export default ImagePreview

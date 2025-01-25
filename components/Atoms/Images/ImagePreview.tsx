import { Box } from '@mui/material'
import { ImageSize } from 'lib/backend/files/fileTypes'
import CenterStack from '../CenterStack'
import OptimizedImage from './OptimizedImage'
import TextExtractor from 'components/Organizms/files/TextExtractor'

const ImagePreview = ({ url, imageSize }: { url: string; imageSize?: ImageSize }) => {
  return (
    <Box>
      <CenterStack>
        <Box sx={{ borderRadius: '16px', paddingTop: '4px' }}>
          <OptimizedImage url={url} title='' imageSize={imageSize} />
        </Box>
      </CenterStack>
      <Box>
        <TextExtractor url={url} />
      </Box>
    </Box>
  )
}

export default ImagePreview

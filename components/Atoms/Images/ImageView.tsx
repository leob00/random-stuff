import { Box } from '@mui/material'
import { ImageSize } from 'lib/backend/files/fileTypes'
import CenterStack from '../CenterStack'
import OptimizedImage from './OptimizedImage'
import TextExtractor from 'components/Organizms/files/TextExtractor'

const ImageView = ({ url, hideTextExtract = false }: { url: string; hideTextExtract?: boolean }) => {
  return (
    <Box>
      <CenterStack>
        <Box sx={{ borderRadius: '16px', paddingTop: '4px' }} minHeight={{ xs: 300, md: 600 }}>
          <OptimizedImage url={url} title='' />
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

export default ImageView

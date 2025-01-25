import { Box, useMediaQuery, useTheme } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'

const PdfViewer = ({ url }: { url: string }) => {
  return (
    <Box>
      <CenterStack sx={{ pt: 2 }}>
        <iframe allowFullScreen style={{ border: 'none' }} src={url} width={'100%'} height={800} />
      </CenterStack>
    </Box>
  )
}

export default PdfViewer

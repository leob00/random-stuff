import { motion } from 'framer-motion'
import { Box } from '@mui/material'

const ImageXRotator = ({ imageUrl, duration = 6, width, height, clickable, onClicked }: { imageUrl: string; duration?: number; width?: number; height?: number; clickable?: boolean; onClicked?: () => void }) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <>
      <Box sx={{ cursor: clickable ? 'pointer' : 'default' }} onClick={handleClick}>
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <motion.img style={{ height: height, width: width }} src={imageUrl} alt='rotating image' animate={{ rotateX: 360 }} transition={{ duration: duration, repeat: Infinity }} />
        </Box>
      </Box>
    </>
  )
}

export default ImageXRotator

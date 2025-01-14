'use client'
import { Backdrop, Box, LinearProgress, Typography, useTheme } from '@mui/material'
import { VeryLightTransparent } from 'components/themes/mainTheme'

const ModalProgress = ({ isOpen, progressPercent, message }: { isOpen: boolean; progressPercent: number; message?: string }) => {
  const theme = useTheme()
  return (
    <Box>
      <Backdrop sx={{ backgroundColor: VeryLightTransparent, zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isOpen}></Backdrop>
      <Box display={'flex'} justifyContent={'center'} width={'100%'} py={2}>
        <Box width={'inherit'}>
          <LinearProgress variant='determinate' value={progressPercent} color='info' />
          {message && (
            <Box py={2}>
              <Typography variant='caption'>{message}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ModalProgress

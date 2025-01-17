import { Box, Drawer, LinearProgress, Typography } from '@mui/material'

const ProgressDrawer = ({ isOpen, message }: { isOpen: boolean; message: string | null }) => {
  return (
    <Drawer open={isOpen} anchor='bottom'>
      <Box px={4} py={4} display={'flex'} flexDirection={'column'} gap={2} justifyContent={'center'}>
        <LinearProgress variant='indeterminate' color={'primary'} />
        {message && (
          <Box>
            <Typography textAlign={'center'} variant='body2'>
              {message}
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  )
}

export default ProgressDrawer

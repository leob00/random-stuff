import { Box, CircularProgress, Typography } from '@mui/material'

const CircleProgress = ({ progress }: { progress?: number }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }} py={1} px={1}>
      <CircularProgress enableTrackSlot variant={progress ? `determinate` : `indeterminate`} color='primary' value={progress} />
      <Box
        sx={{
          top: 0,
          left: 2,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {progress && <Typography variant='caption' fontSize={12} fontWeight={'bold'} component='div'>{`${Math.round(progress)}%`}</Typography>}
      </Box>
    </Box>
  )
}

export default CircleProgress

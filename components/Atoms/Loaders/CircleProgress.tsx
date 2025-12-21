import { Box, Breakpoint, CircularProgress, CircularProgressPropsVariantOverrides, Typography } from '@mui/material'

const CircleProgress = ({ progress, size = 'xs', variant }: { progress?: number; size?: Breakpoint; variant?: 'determinate' | 'indeterminate' }) => {
  let displaySize = size === 'xs' ? 40 : 40
  if (size === 'xl') {
    displaySize = 400
  }
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }} py={1} px={1}>
      <CircularProgress
        enableTrackSlot
        variant={variant ? variant : progress ? `determinate` : `indeterminate`}
        color={progress && progress > 98 ? 'success' : 'info'}
        value={progress}
        size={displaySize}
      />
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
        {size === 'xl' ? (
          <>
            <Typography variant='h1' fontSize={11.3} fontWeight={'bold'} component='div'>{`${progress ?? Math.floor(progress ?? 0)}%`}</Typography>
          </>
        ) : (
          <>
            {progress !== undefined && progress > 0 && (
              <Typography variant='caption' fontSize={11.3} fontWeight={'bold'} component='div'>{`${progress > 0 ? Math.floor(progress) : 0}%`}</Typography>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

export default CircleProgress

import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import CenterStack from '../CenterStack'
import SuccessButton from '../Buttons/SuccessButton'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

const AudioPlayer = ({ source }: { source: string }) => {
  const playerRef = useRef<HTMLAudioElement | null>(null)
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const [showCustomControls, setShowCustomControls] = useState(true)

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.muted = false
      if (playerRef.current.paused) {
        playerRef.current.play()
        setShowCustomControls(false)
      }
    }
  }

  useEffect(() => {
    if (playerRef.current) {
      if (isXSmall) {
        playerRef.current.muted = true
      }
    }
  }, [isXSmall])

  return (
    <Box minHeight={150}>
      <Box display={showCustomControls ? 'none' : 'unset'}>
        <audio controls ref={playerRef} onPlay={handlePlay} preload='auto'>
          <source src={source} type='audio/mpeg' />
          <source src={source} type='audio/ogg' />
          Your browser does not support the audio element.
        </audio>
      </Box>
      {showCustomControls && (
        <CenterStack sx={{ py: 2 }}>
          <SuccessButton text='play' onClick={handlePlay} startIcon={<PlayArrowIcon />} />
        </CenterStack>
      )}
    </Box>
  )
}

export default AudioPlayer

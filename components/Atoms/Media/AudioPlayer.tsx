import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import CenterStack from '../CenterStack'
import SuccessButton from '../Buttons/SuccessButton'

const AudioPlayer = ({ source }: { source: string }) => {
  const playerRef = useRef<HTMLAudioElement | null>(null)
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const [showCustomControls, setShowCustomControls] = useState(isXSmall)

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
  }, [])

  return (
    <>
      <Box display={showCustomControls ? 'none' : 'unset'}>
        <audio controls ref={playerRef} onPlay={handlePlay} preload='auto'>
          <source src={source} type='audio/mpeg' />
          <source src={source} type='audio/ogg' />
          Your browser does not support the audio element.
        </audio>
      </Box>
      {showCustomControls && (
        <CenterStack sx={{ py: 2 }}>
          <SuccessButton text='play' onClick={handlePlay} />
        </CenterStack>
      )}
    </>
  )
}

export default AudioPlayer

import { Box, IconButton, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { useEffect, useState } from 'react'
import CachedIcon from '@mui/icons-material/Cached'
import FadeOut from 'components/Atoms/Animations/FadeOut'

const FadeOutTest = () => {
  const [refresh, setRefresh] = useState(true)
  useEffect(() => {
    if (refresh) {
      setRefresh(false)
    }
  }, [refresh])
  return (
    <Box py={2}>
      <CenterStack>
        <Typography>Fade out</Typography>
      </CenterStack>
      <Box py={2} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2}>
        {refresh ? (
          <ListHeader item={null} text='testing header fade in' disabled fadeIn={true} />
        ) : (
          <FadeOut>
            <ListHeader item={null} text='testing header fade in' disabled fadeIn={false} />
          </FadeOut>
        )}

        <Box>
          <IconButton onClick={() => setRefresh(!refresh)}>
            <CachedIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default FadeOutTest

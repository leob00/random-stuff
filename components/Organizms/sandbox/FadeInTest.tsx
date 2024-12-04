import { Box, IconButton, Typography } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import CenterStack from 'components/Atoms/CenterStack'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { useEffect, useState } from 'react'
import CachedIcon from '@mui/icons-material/Cached'

const FadeInTest = () => {
  const [refresh, setRefresh] = useState(false)
  useEffect(() => {
    if (refresh) {
      setRefresh(false)
    }
  }, [refresh])
  return (
    <Box py={2}>
      <CenterStack>
        <Typography>Fade in</Typography>
      </CenterStack>
      <Box py={2} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2}>
        {!refresh ? (
          <FadeIn>
            <ListHeader item={null} text='testing header fade in' disabled />
          </FadeIn>
        ) : (
          <ListHeader item={null} text='testing header fade in' disabled />
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

export default FadeInTest

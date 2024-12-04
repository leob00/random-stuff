import { Box, IconButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import CachedIcon from '@mui/icons-material/Cached'
import { useEffect, useState } from 'react'
import FadeInTest from './FadeInTest'
import FadeOutTest from './FadeOutTest'

const Framer = () => {
  return (
    <Box>
      <CenteredTitle title='Framer Examples' />
      <HorizontalDivider />
      <Box py={2}>
        <FadeInTest />
        <FadeOutTest />
      </Box>
    </Box>
  )
}

export default Framer

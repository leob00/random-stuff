import { Box, Typography } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import ListHeader from 'components/Molecules/Lists/ListHeader'

const Framer = () => {
  return (
    <Box>
      <CenteredTitle title='Framer Examples' />
      <HorizontalDivider />
      <Box py={2}>
        <CenterStack>
          <Typography>Fade in</Typography>
        </CenterStack>
        <Box py={2}>
          <FadeIn>
            <ListHeader item={null} text='testing header fade in' onClicked={() => {}} />
          </FadeIn>
        </Box>
      </Box>
    </Box>
  )
}

export default Framer

import { Box, Container, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import GradientContainer from './Atoms/Boxes/GradientContainer'

const Footer = () => {
  return (
    <GradientContainer>
      <Container>
        <Container>
          <Stack direction='row' display={'flex'} spacing={2} divider={<Divider orientation='vertical' flexItem />} py={4} alignItems={'center'}>
            <Box>
              <Typography variant='caption'>©{dayjs().format('YYYY')} Random Stuff</Typography>
            </Box>
          </Stack>
        </Container>
      </Container>
    </GradientContainer>
  )
}

export default Footer

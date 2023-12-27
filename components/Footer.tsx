import { Box, Container, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const Footer = () => {
  return (
    <Container>
      <Container>
        <HorizontalDivider />
        <Stack direction='row' display={'flex'} spacing={2} divider={<Divider orientation='vertical' flexItem />} py={4} alignItems={'center'}>
          <Box>
            <Typography variant='caption'>©{dayjs().format('YYYY')} Random Stuff</Typography>
          </Box>
        </Stack>
      </Container>
    </Container>
  )
}

export default Footer

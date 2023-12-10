import * as React from 'react'
import { Box, Container, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import HorizontalDivider from './Atoms/Dividers/HorizontalDivider'

const Footer = () => {
  const [isLoading, setIsLoading] = React.useState(true)

  return (
    <Container>
      <Container>
        <HorizontalDivider />

        <Stack direction='row' display={'flex'} spacing={2} divider={<Divider orientation='vertical' flexItem />} py={4} alignItems={'center'}>
          <Box>
            <Typography variant='caption'>©{dayjs().format('YYYY')} Random Stuff</Typography>
          </Box>
          {/* <Box>
            {isLoading ? (
              <RollingLinearProgress height={20} />
            ) : (
              <Box>
                <Stack alignItems={'center'} flexDirection={'row'}>
                  <Circle color={'secondary'} fontSize='small' />
                  <Typography variant='caption' pl={1}>
                    online
                  </Typography>
                </Stack>
              </Box>
            )}
          </Box> */}
        </Stack>
      </Container>
    </Container>
  )
}

export default Footer

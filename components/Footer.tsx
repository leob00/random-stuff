import * as React from 'react'
import { Box, Container, Divider, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { ApiStatus } from 'pages/api/status'
import Circle from '@mui/icons-material/Circle'
import HorizontalDivider from './Atoms/Dividers/HorizontalDivider'
import RollingLinearProgress from './Atoms/Loaders/RollingLinearProgress'
import { get } from 'lib/backend/api/fetchFunctions'

const Footer = () => {
  // const intervalRef = React.useRef<NodeJS.Timer | null>(null)
  // const [counter, setCounter] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)

  // React.useEffect(() => {
  //   const fn = async () => {
  //     setIsLoading(true)
  //     await get('/api/edgeStatus')
  //     //console.log(`status: ${result.status} - date: ${dayjs(result.date).format('MM/DD/YYYY hh:mm:ss a')}`)
  //     setCounter(counter + 1)

  //     if (intervalRef.current) {
  //       setIsLoading(false)
  //       clearInterval(intervalRef.current)
  //     }
  //   }
  //   if (counter === 0) {
  //     setTimeout(() => {
  //       //console.log('initializing heart beat...')
  //       fn().then(() => console.log('heart beat started'))
  //     }, 1000)
  //   }
  //   intervalRef.current = setInterval(() => {
  //     fn()
  //   }, 480000)
  // }, [counter])
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

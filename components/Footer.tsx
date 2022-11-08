import * as React from 'react'
import { Box, Container, Divider, LinearProgress, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import AppHeartbeat from './Organizms/AppHeartbeat'
import { axiosGet } from 'lib/backend/api/qln/useAxios'
import { ApiStatus } from 'pages/api/status'

const Footer = () => {
  const intervalRef = React.useRef<NodeJS.Timer | null>(null)
  const [counter, setCounter] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fn = async () => {
      setIsLoading(true)
      const result = (await axiosGet('/api/status')) as ApiStatus
      console.log(`status: ${result.status} - date: ${dayjs(result.date).format('MM/DD/YYYY hh:mm:ss a')}`)
      setCounter(counter + 1)

      if (intervalRef.current) {
        setIsLoading(false)
        clearInterval(intervalRef.current)
      }
    }
    if (counter === 0) {
      setTimeout(() => {
        console.log('initializing heart beat...')
        fn().then(() => console.log('heart beat started'))
      }, 1000)
      //clearTimeout(timeOut)
    }
    intervalRef.current = setInterval(() => {
      fn()
    }, 60000)
  }, [counter])
  return (
    <Container>
      <Divider />
      <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' flexItem />} py={4}>
        <Typography sx={{ fontSize: 'small' }}>©{dayjs().format('YYYY')} Random Stuff</Typography>
        {isLoading ? (
          <Box minWidth={100} alignContent='center' justifyContent={'center'} pt={1}>
            <LinearProgress color='secondary' />
          </Box>
        ) : (
          <Box minWidth={100} alignContent='center' justifyContent={'center'}>
            <Typography sx={{ fontSize: 'small' }}>status: online</Typography>
          </Box>
        )}
      </Stack>
      <Stack direction='row' spacing={2}></Stack>
    </Container>
  )
}

export default Footer

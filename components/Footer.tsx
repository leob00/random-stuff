import * as React from 'react'
import { Box, Container, Divider, LinearProgress, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import AppHeartbeat from './Organizms/AppHeartbeat'
import { axiosGet } from 'lib/backend/api/qln/useAxios'
import { ApiStatus } from 'pages/api/status'
import { Circle } from '@mui/icons-material'
import { CasinoGreen } from './themes/mainTheme'

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
    }, 240000)
  }, [counter])
  return (
    <Container>
      <Divider />
      <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' flexItem />} py={4}>
        <Typography sx={{ fontSize: 'small' }}>©{dayjs().format('YYYY')} Random Stuff</Typography>
        {isLoading ? (
          <Stack minWidth={110} alignContent='center' justifyContent={'center'} pt={1}>
            <LinearProgress color='secondary' />
          </Stack>
        ) : (
          <Stack>
            <Stack fontSize={'small'} justifyContent={'center'} flexDirection={'row'}>
              <Circle color={'success'} fontSize='small' sx={{ mr: 1, ml: 1 }} />
              online
            </Stack>
          </Stack>
        )}
      </Stack>
    </Container>
  )
}

export default Footer

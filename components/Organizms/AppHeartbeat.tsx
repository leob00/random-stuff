import dayjs from 'dayjs'
import { axiosGet } from 'lib/backend/api/qln/useAxios'
import { ApiStatus } from 'pages/api/status'
import React, { ReactNode } from 'react'
import NonSSRWrapper from './NonSSRWrapper'

const AppHeartbeat = ({ children }: { children: ReactNode }) => {
  const intervalRef = React.useRef<NodeJS.Timer | null>(null)
  const [counter, setCounter] = React.useState(0)

  React.useEffect(() => {
    const fn = async () => {
      const result = (await axiosGet('/api/status')) as ApiStatus
      console.log(`status: ${result.status} - date: ${dayjs(result.date).format('MM/DD/YYYY hh:mm:ss a')}`)
      setCounter(counter + 1)
      if (intervalRef.current) {
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
  return <NonSSRWrapper>{children}</NonSSRWrapper>
}

export default AppHeartbeat

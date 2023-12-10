import dayjs from 'dayjs'
import { get } from 'lib/backend/api/fetchFunctions'
import { ApiStatus } from 'pages/api/status'
import React, { ReactNode } from 'react'
import NonSSRWrapper from './NonSSRWrapper'

const AppHeartbeat = ({ children }: { children: ReactNode }) => {
  const intervalRef = React.useRef<NodeJS.Timer | null>(null)
  const [counter, setCounter] = React.useState(0)

  React.useEffect(() => {
    const fn = async () => {
      const result = (await get('/api/edgeStatus')) as ApiStatus
      setCounter(counter + 1)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    if (counter === 0) {
      setTimeout(() => {}, 1000)
    }
    intervalRef.current = setInterval(() => {
      fn()
    }, 60000)
  }, [counter])
  return <NonSSRWrapper>{children}</NonSSRWrapper>
}

export default AppHeartbeat

import React from 'react'

export const usePolling = (intervalSeconds: number = 3, restartAfter?: number, stopped?: boolean) => {
  const [pollCounter, setPollCounter] = React.useState(0)
  const [isStopped, setIsStopped] = React.useState(stopped ?? false)
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const stop = () => {
    setIsStopped(true)
    setPollCounter(0)
  }
  const start = () => {
    setIsStopped(false)
  }

  React.useEffect(() => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    if (!isStopped) {
      timeOutRef.current = setTimeout(() => {
        let newCounter = pollCounter + 1
        if (restartAfter) {
          if (newCounter > restartAfter) {
            newCounter = 0
          }
        }
        setPollCounter(newCounter)
      }, intervalSeconds * 1000)
    }
  }, [pollCounter, isStopped])

  return {
    pollCounter,
    isStopped,
    stop,
    start,
  }
}

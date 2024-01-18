import React from 'react'

export const usePolling = (intervalMilliseconds: number = 3000, restartAfter?: number, stopped?: boolean) => {
  const [pollCounter, setPollCounter] = React.useState(0)
  const [isStopped, setIsStopped] = React.useState(stopped ?? false)
  const [isPaused, setIsPased] = React.useState(stopped ?? false)
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const stop = () => {
    setIsStopped(true)
    setPollCounter(0)
    setIsPased(false)
  }
  const start = () => {
    setIsStopped(false)
    setIsPased(false)
  }

  const pause = (paused: boolean) => {
    setIsPased(paused)
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
      }, intervalMilliseconds)
    }
  }, [pollCounter, isStopped])

  return {
    pollCounter,
    isStopped,
    isPaused,
    stop,
    start,
    pause,
  }
}

import React from 'react'

export const usePolling = (intervalSeconds: number = 3, restartAfter?: number) => {
  const [pollCounter, setPollCounter] = React.useState(0)
  const timeOutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }

    timeOutRef.current = setTimeout(() => {
      let newCounter = pollCounter + 1
      if (restartAfter) {
        if (newCounter > restartAfter) {
          newCounter = 0
        }
      }
      setPollCounter(newCounter)
    }, intervalSeconds * 1000)
  }, [pollCounter])

  return {
    pollCounter,
  }
}

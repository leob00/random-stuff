import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { Box } from '@mui/material'
import CircleLoader from 'components/Atoms/Loaders/CircleLoader'
import { ReactNode, useEffect, useRef, useState } from 'react'

const DelayedComponentRender = ({ delayMs, children }: { delayMs: number; children: ReactNode | ReactJSXElement[] }) => {
  const timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current)
    }
    timeOutRef.current = setTimeout(() => {
      setIsLoading(false)
    }, delayMs)
  }, [])

  return (
    <Box minHeight={500}>
      {isLoading && <CircleLoader />}
      {!isLoading && <Box>{children}</Box>}
    </Box>
  )
}

export default DelayedComponentRender

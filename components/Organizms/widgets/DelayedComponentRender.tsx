import { Box } from '@mui/material'
import { ReactElement, ReactNode, useEffect, useState } from 'react'

const DelayedComponentRender = ({ delayMs, children }: { delayMs: number; children: ReactNode | ReactElement[] }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
      //console.log('rendered in: ', delayMs)
    }, delayMs)
  }, [delayMs])

  return <Box>{!isLoading && <Box>{children}</Box>}</Box>
}

export default DelayedComponentRender

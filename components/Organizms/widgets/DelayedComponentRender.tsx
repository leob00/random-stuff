import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { Box } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'

const DelayedComponentRender = ({ delayMs, children }: { delayMs: number; children: ReactNode | ReactJSXElement[] }) => {
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

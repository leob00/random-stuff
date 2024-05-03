import { Button } from '@mui/material'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import React from 'react'
import { useRouter } from 'next/router'

const BackButton = ({ route, onClicked }: { route?: string; onClicked?: () => void }) => {
  const router = useRouter()
  const { getLastRoute } = useRouteTracker()
  const lastRoute = getLastRoute()

  const handleClick = () => {
    if (route) {
      router.push(route)
      return
    }
    if (onClicked) {
      onClicked?.()
      return
    }
    if (!route) {
      router.push(lastRoute)
      return
    }
  }
  return (
    <Button variant='text' onClick={handleClick} color='primary'>
      &#8592; back
    </Button>
  )
}

export default BackButton

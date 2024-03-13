import { Button } from '@mui/material'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import React from 'react'
import { useRouter } from 'next/router'

const BackButton = ({ route, onClicked }: { route?: string; onClicked?: () => void }) => {
  const router = useRouter()
  const lastRoute = useRouteTracker().getLastRoute()
  const handleClick = () => {
    if (route) {
      router.push(route)
      return
    }
    if (lastRoute.length > 0) {
      router.push(lastRoute)
      return
    }
    router.push('/')
  }
  return (
    <Button variant='text' onClick={onClicked ?? handleClick} color='primary'>
      &#8592; back
    </Button>
  )
}

export default BackButton

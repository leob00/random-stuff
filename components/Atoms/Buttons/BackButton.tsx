import { Button } from '@mui/material'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import React from 'react'
import { useRouter } from 'next/router'

const BackButton = ({ route, onClicked }: { route?: string; onClicked?: () => void }) => {
  const router = useRouter()
  const { getLastRoute } = useRouteTracker()

  const handleClick = () => {
    if (!route && !onClicked) {
      router.push('/')
      return
    }

    if (route) {
      router.push(route)
      return
    }
    onClicked?.()
  }
  return (
    <Button variant='text' onClick={handleClick} color='primary'>
      &#8592; back
    </Button>
  )
}

export default BackButton

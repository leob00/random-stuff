import { Button } from '@mui/material'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import React from 'react'
import { useRouter } from 'next/navigation'

const BackButton = ({ onClicked }: { onClicked?: () => void }) => {
  const router = useRouter()
  const lastRoute = useRouteTracker().getLastRoute()
  // console.log('lastRoute: ', lastRoute)
  const handleClick = () => {
    if (lastRoute.length > 0) {
      router.push(lastRoute)
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

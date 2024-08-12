'use client'
import { Button } from '@mui/material'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import React from 'react'
import { useRouter } from 'next/router'

const BackButton = ({ route }: { route?: string }) => {
  const router = useRouter()
  const { previousRoute } = useRouteTracker()

  const handleClick = () => {
    if (route) {
      router.push(route)
      return
    }

    if (!route) {
      router.push(previousRoute.path)
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

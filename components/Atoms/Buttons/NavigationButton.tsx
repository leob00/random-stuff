'use client'
import { Button, Typography, TypographyProps } from '@mui/material'
import { useRouter } from 'next/navigation'
import BackdropLoader from '../Loaders/BackdropLoader'
import { useState } from 'react'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import { Navigation } from 'components/Organizms/session/useSessionSettings'

type PageProps = Navigation

const NavigationButton = ({ ...props }: PageProps & TypographyProps) => {
  const { addRoute } = useRouteTracker()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    addRoute(props.path)
    setIsLoading(true)
    router.push(props.path)
  }
  return (
    <>
      {isLoading && <BackdropLoader />}
      <Button variant='text' onClick={handleClick}>
        <Typography variant={props.variant ?? 'h5'}>{props.name}</Typography>
      </Button>
    </>
  )
}

export default NavigationButton

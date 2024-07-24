'use client'
import React from 'react'
import { Button, Typography, TypographyProps } from '@mui/material'
import { useRouter } from 'next/navigation'
import BackdropLoader from '../Loaders/BackdropLoader'

type PageProps = { text: string; route: string }

const NavigationButton = ({ ...props }: PageProps & TypographyProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true)
    router.push(props.route)
  }
  return (
    <>
      {isLoading && <BackdropLoader />}
      <Button variant='text' onClick={handleClick}>
        <Typography variant={props.variant ?? 'h5'}>{props.text}</Typography>
      </Button>
    </>
  )
}

export default NavigationButton

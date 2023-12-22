import React from 'react'
import { Button, ButtonProps, Typography, TypographyProps } from '@mui/material'
import router from 'next/router'
import BackdropLoader from '../Loaders/BackdropLoader'
import { useTheme } from '@mui/material'

type PageProps = { text: string; route: string }

const NavigationButton = ({ ...props }: PageProps & TypographyProps) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true)
    router.push(props.route)
  }
  return (
    <>
      {isLoading && <BackdropLoader />}
      <Button variant='text' onClick={handleClick}>
        <Typography variant={props.variant ?? 'h4'}>{props.text}</Typography>
      </Button>
    </>
  )
}

export default NavigationButton

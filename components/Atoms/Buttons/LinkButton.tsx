import React, { ReactNode } from 'react'
import { Button } from '@mui/material'

const LinkButton = ({ children, onClick }: { children: ReactNode; onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void }) => {
  //const color = props.color
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick(e)
  }
  return (
    <Button color={'secondary'} variant='text' onClick={handleClick}>
      {children}
    </Button>
  )
}

export default LinkButton

import React, { ReactNode } from 'react'
import { Button } from '@mui/material'

const LinkButton = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
  //const color = props.color
  return (
    <Button color={'secondary'} variant='text' onClick={onClick}>
      {children}
    </Button>
  )
}

export default LinkButton

import { Button, Typography } from '@mui/material'
import React from 'react'
const MenuLinkButton = ({ text, onClicked }: { text: string; onClicked: () => void }) => {
  return (
    <Button size={'small'} onClick={onClicked}>
      <Typography variant='h6' color='primary'>
        {text}
      </Typography>
    </Button>
  )
}

export default MenuLinkButton

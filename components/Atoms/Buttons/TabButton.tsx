import { Box, Button, ButtonProps } from '@mui/material'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'
import { truncate } from 'fs'
import React, { ReactNode } from 'react'

interface CustomProps {
  selected?: boolean
  title: string
  onClicked: (title: string) => void
}

const TabButton = ({ selected, title, onClicked, ...props }: CustomProps & ButtonProps) => {
  //const [isSelected, setIsSelected] = React.useState(selected)
  const handleClick = (title: string) => {
    //setIsSelected(true)
    onClicked(title)
  }
  return (
    <Button
      {...props}
      variant='text'
      onClick={() => {
        handleClick(title)
      }}
      disabled={selected}
    >
      <Box sx={{ borderBottom: selected ? `2px solid ${CasinoBlueTransparent}` : 'unset' }} p={1} color={CasinoBlueTransparent} minWidth={{ xs: 60, sm: 80 }}>
        {title}
      </Box>
    </Button>
  )
}

export default TabButton

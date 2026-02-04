'use client'
import { Box, Button, ButtonProps } from '@mui/material'
import { CasinoBlueTransparent, VeryLightBlue } from 'components/themes/mainTheme'
import { useTheme } from '@mui/material'

interface CustomProps {
  selected?: boolean
  title: string
  onClicked: (title: string) => void
}

const TabButton = ({ selected, title, onClicked, ...props }: CustomProps & ButtonProps) => {
  const theme = useTheme()
  const color = theme.palette.mode === 'dark' ? VeryLightBlue : CasinoBlueTransparent
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
      <Box sx={{ borderBottom: selected ? `2px solid ${color}` : 'unset' }} p={1} color={color} minWidth={{ xs: 60, sm: 80 }}>
        {title}
      </Box>
    </Button>
  )
}

export default TabButton

'use client'
import { IconButton } from '@mui/material'
import LastPageIcon from '@mui/icons-material/LastPage'

const ArrowLastPageButton = ({ disabled, onClicked }: { disabled: boolean; onClicked: () => void }) => {
  return (
    <IconButton size='small' onClick={onClicked} disabled={disabled}>
      <LastPageIcon fontSize='small' color={disabled ? 'disabled' : 'primary'} />
    </IconButton>
  )
}

export default ArrowLastPageButton

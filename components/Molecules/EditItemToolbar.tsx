import Save from '@mui/icons-material/Save'
import Close from '@mui/icons-material/Close'
import Create from '@mui/icons-material/Create'
import Delete from '@mui/icons-material/Delete'

import { Box, Stack, IconButton } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const EditItemToolbar = ({
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: {
  onSave?: () => void
  onCancel?: () => void
  onEdit?: (item: any) => void
  onDelete?: () => void
}) => {
  const handleSaveClick = () => {
    onSave?.()
  }
  const handleCancelClick = () => {
    onCancel?.()
  }
  const handleEditClick = (item: any) => {
    onEdit?.(item)
  }
  const handleDeletelClick = () => {
    onDelete?.()
  }

  return (
    <Box>
      <Stack display='flex' flexDirection='row' gap={0} justifyContent='center' py={2}>
        {onSave && (
          <Stack>
            <IconButton onClick={handleSaveClick} color='primary'>
              <Save />
            </IconButton>
          </Stack>
        )}
        {onEdit && (
          <Stack>
            <IconButton onClick={handleEditClick} color='primary'>
              <Create />
            </IconButton>
          </Stack>
        )}
        {onDelete && (
          <Stack>
            <IconButton onClick={handleDeletelClick} color='primary'>
              <Delete color='error' />
            </IconButton>
          </Stack>
        )}
        {onCancel && (
          <Stack>
            <IconButton onClick={handleCancelClick} color='primary'>
              <Close />
            </IconButton>
          </Stack>
        )}
      </Stack>
      <HorizontalDivider />
    </Box>
  )
}
export default EditItemToolbar

import { Save, Close, Create, Delete } from '@mui/icons-material'
import { Box, Stack, IconButton, Divider } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const EditItemToolbar = ({ onSave, onCancel, onEdit, onDelete }: { onSave?: () => void; onCancel?: () => void; onEdit?: (item: any) => void; onDelete?: () => void }) => {
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
            <IconButton onClick={handleSaveClick} color='secondary'>
              <Save />
            </IconButton>
          </Stack>
        )}
        {onEdit && (
          <Stack>
            <IconButton onClick={handleEditClick} color='secondary'>
              <Create />
            </IconButton>
          </Stack>
        )}
        {onDelete && (
          <Stack>
            <IconButton onClick={handleDeletelClick} color='secondary'>
              <Delete color='error' />
            </IconButton>
          </Stack>
        )}
        {onCancel && (
          <Stack>
            <IconButton onClick={handleCancelClick} color='secondary'>
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

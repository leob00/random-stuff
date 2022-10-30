import { Save, Close, Create } from '@mui/icons-material'
import { Box, Stack, IconButton, Divider } from '@mui/material'

const EditItemToolbar = ({ onSave, onCancel, onEdit }: { onSave?: () => void; onCancel?: () => void; onEdit?: (item: any) => void }) => {
  const handleSaveClick = () => {
    onSave?.()
  }
  const handleCancelClick = () => {
    onCancel?.()
  }
  const handleEditClick = (item: any) => {
    onEdit?.(item)
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
        {onCancel && (
          <Stack>
            <IconButton onClick={handleCancelClick} color='secondary'>
              <Close />
            </IconButton>
          </Stack>
        )}
      </Stack>
      <Divider />
    </Box>
  )
}
export default EditItemToolbar

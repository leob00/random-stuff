import { Box } from '@mui/material'
import { UserSecret } from 'lib/backend/api/models/zModels'
import SecretListItem from './SecretListItem'

const SecretLayout = ({ encKey, userSecret, onEdit }: { encKey: string; userSecret: UserSecret; onEdit: (item: UserSecret) => void }) => {
  const handleEditClick = () => {
    onEdit(userSecret)
  }

  return (
    <Box>
      <SecretListItem encKey={encKey} data={userSecret} onEdit={handleEditClick} />
    </Box>
  )
}

export default SecretLayout

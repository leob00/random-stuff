import { Box, IconButton, Typography } from '@mui/material'
import { UserProfile } from 'lib/backend/api/aws/apiGateway'
import React from 'react'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'

const StockSubscibeIcon = ({ userProfile }: { userProfile: UserProfile }) => {
  const [showAlertEdit, setShowAlertEdit] = React.useState(false)

  const handleEditAlerts = () => {
    setShowAlertEdit(true)
  }

  return (
    <Box>
      <FormDialog title={'Alerts'} show={showAlertEdit} onCancel={() => setShowAlertEdit(false)} fullScreen>
        <Box>
          <Typography>coming soon</Typography>
        </Box>
      </FormDialog>
      <Box>
        <IconButton size='small' color='success' onClick={handleEditAlerts}>
          <NotificationAddIcon fontSize='small' />
        </IconButton>
      </Box>
    </Box>
  )
}

export default StockSubscibeIcon

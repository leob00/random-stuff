import { Box } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import { Job } from 'lib/backend/api/qln/qlnApi'
import { useState } from 'react'

const StopJobDisplay = ({ data, onSave }: { data: Job; onSave: (item: Job) => void }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const handleConfirmStop = async () => {
    setShowConfirm(false)
    onSave({ ...data, Status: 2, NextRunDate: null })
  }
  const handleStop = () => {
    setShowConfirm(true)
  }
  return (
    <>
      <Box py={2}>
        <DangerButton text='stop' type='submit' onClick={handleStop} />
      </Box>
      <ConfirmDeleteDialog
        title='Stop Job'
        text={`Are you sure you want to stop ${data.Name}?`}
        show={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmStop}
      />
    </>
  )
}

export default StopJobDisplay

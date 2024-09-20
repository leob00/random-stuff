import { Box } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import { Job, QlnApiRequest, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { useState } from 'react'
import { mutate } from 'swr'

const StopJobDisplay = ({ data, onSave }: { data: Job; onSave: (item: Job) => void }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const { claims } = useSessionStore()
  const handleConfirm = async () => {
    setShowConfirm(false)
    onSave({ ...data, Status: 2 })
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
        onConfirm={handleConfirm}
      />
    </>
  )
}

export default StopJobDisplay

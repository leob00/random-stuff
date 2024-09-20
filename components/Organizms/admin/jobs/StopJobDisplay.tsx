import { Box } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import { Job, QlnApiRequest, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { useState } from 'react'
import { mutate } from 'swr'

const StopJobDisplay = ({ data, mutateKey }: { data: Job; mutateKey: string }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const { claims, saveClaims } = useSessionStore()
  const claim = claims.find((m) => m.type === 'qln')
  const handleConfirm = async () => {
    setShowConfirm(false)
    const url = `/BatchJobDetail?Token=${claim?.token ?? ''}`
    const req: QlnApiRequest = {
      body: { ...data, Status: 2, NextRunDate: null },
    }
    await serverPostFetch(req, url)
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

import { Box } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import { Job } from 'lib/backend/api/qln/qlnApi'
import { mutate } from 'swr'

const StopJobDisplay = ({ data, mutateKey }: { data: Job; mutateKey: string }) => {
  const handleStop = () => {
    const newData = { ...data, Status: 2 }
    mutate(mutateKey, newData, { revalidate: false })
  }
  return (
    <Box py={2}>
      <DangerButton text='stop' type='submit' onClick={handleStop} />
    </Box>
  )
}

export default StopJobDisplay

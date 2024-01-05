import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { usePolling } from 'hooks/usePolling'
import { calculatePercentInt } from 'lib/util/numberUtil'
import React from 'react'

const Playground = () => {
  const max = 10
  const { pollCounter, isStopped, stop, start } = usePolling(5, max, true)
  return (
    <Box py={2}>
      <CenteredHeader title='Playground' />
      <Box py={2}>
        <ReadOnlyField label='poll counter' val={pollCounter} />
        <Box py={2}>
          <ProgressBar width={275} value={calculatePercentInt(pollCounter, max)} />
        </Box>
        <HorizontalDivider />
        <Box display={'flex'} gap={2} pt={2}>
          {!isStopped && <DangerButton text='stop' size='small' onClick={stop} />}
          {isStopped && <PrimaryButton text='start' size='small' onClick={start} />}
        </Box>
      </Box>
    </Box>
  )
}

export default Playground

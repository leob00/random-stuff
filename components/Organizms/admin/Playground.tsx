import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import JsonView from 'components/Atoms/Boxes/JsonView'
import ProgressBar from 'components/Atoms/Progress/ProgressBar'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import MutliControlForm, { FormValues } from 'components/Molecules/Forms/ReactHookForm/MultiControlForm'
import { usePolling } from 'hooks/usePolling'
import { calculatePercentInt } from 'lib/util/numberUtil'
import React from 'react'

const Playground = () => {
  const max = 10
  const { pollCounter } = usePolling(3, max)
  return (
    <Box py={2}>
      <CenteredHeader title='Playground' />
      <Box py={2}>
        <ReadOnlyField label='poll counter' val={pollCounter} />
        <ProgressBar width={275} value={calculatePercentInt(pollCounter, max)} />
      </Box>
    </Box>
  )
}

export default Playground

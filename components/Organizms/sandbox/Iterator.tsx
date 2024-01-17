import { Box } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { usePolling } from 'hooks/usePolling'
import { sleep } from 'lib/util/timers'
import { range } from 'lodash'
import React from 'react'

const Iterator = () => {
  const [items, setItems] = React.useState(range(0, 25))
  const { pollCounter, isStopped, stop, start, onEllapsed } = usePolling(24, 24, true)

  const handleIterate = async () => {
    start()
  }

  return (
    <>
      <Box py={2}>
        <PrimaryButton text='iterate' onClick={handleIterate} />
      </Box>
      {items.map((item) => (
        <Box key={item}>
          <ListHeader item={item} onClicked={() => {}} text={`${item}`} />
        </Box>
      ))}
    </>
  )
}

export default Iterator

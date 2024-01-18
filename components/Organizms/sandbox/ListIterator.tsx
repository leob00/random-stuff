import { Box, Paper } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import ProgressDialog from 'components/Atoms/Dialogs/ProgressDialog'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { usePolling } from 'hooks/usePolling'
import { sleep } from 'lib/util/timers'
import React from 'react'

export interface QueuedTask {
  id: string
  description: string
  fn: Promise<any>
  isProcesssing?: boolean
}

const ListIterator = ({ items, pollingInterval = 250 }: { items: QueuedTask[]; pollingInterval?: number }) => {
  const [stateItems, setStateItems] = React.useState(items)
  const [processingItem, setProcessingItem] = React.useState<QueuedTask | null>(items[0])
  const { pollCounter, isStopped, isPaused, stop, start, pause } = usePolling(pollingInterval, items.length, true)

  const handleIterate = async () => {
    if (stateItems.length === 0) {
      setStateItems(items)
    }
    start()
  }

  React.useEffect(() => {
    const fn = async () => {
      if (!isStopped && !isPaused) {
        pause(true)
        const newItems = [...stateItems]
        if (newItems.length > 0) {
          const removed = newItems.splice(0, 1)[0]
          //console.log('removed: ', removed)
          setProcessingItem(removed)
          setStateItems(newItems)

          await sleep(pollingInterval)
          setProcessingItem(null)
          pause(false)
        } else {
          stop()
        }
      }
    }
    fn()
  }, [isStopped, isPaused, pollCounter])

  return (
    <>
      <Box py={2}>
        <PrimaryButton text='iterate' onClick={handleIterate} disabled={!isStopped} />
      </Box>
      <ProgressDialog title='work in progress...' show={!isStopped} showActionButtons={false}>
        <>
          {processingItem && (
            <Paper>
              <ListHeader item={processingItem} onClicked={() => {}} text={`${processingItem.description}`} />
            </Paper>
          )}
          {stateItems.slice(0, 5).map((item) => (
            <Box key={item.id}>
              <ListHeader item={item} onClicked={() => {}} text={`${item.description}`} />
            </Box>
          ))}
        </>
      </ProgressDialog>
    </>
  )
}

export default ListIterator
function async(fn: Promise<any>) {
  throw new Error('Function not implemented.')
}

import { Alert, Box, Button, TableCell, TableRow, Typography } from '@mui/material'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import dayjs from 'dayjs'
import { constructStockAlertsSubSecondaryKey } from 'lib/backend/api/aws/util'
import { StockAlertSubscription, StockAlertTrigger, StockQuote } from 'lib/backend/api/models/zModels'
import { getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { deleteRecord } from 'lib/backend/csr/nextApiWrapper'
import { saveTrigger } from 'lib/ui/alerts/stockAlertHelper'
import React from 'react'
import { mutate } from 'swr'
import StockSubscriptionForm from './StockSubscriptionForm'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Clickable from 'components/Atoms/Containers/Clickable'
import { useRouter } from 'next/router'
dayjs.extend(customParseFormat)

const StockAlertRow = ({ sub, username }: { sub: StockAlertSubscription; username: string }) => {
  const [editSub, setEditSub] = React.useState<StockAlertSubscription | null>(null)
  const [quote, setQuote] = React.useState<StockQuote | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)
  const router = useRouter()

  const handleEdit = async (item: StockAlertSubscription) => {
    setIsLoading(true)
    const subCopy = { ...item }
    const q = await getStockQuotes([item.symbol])
    setIsLoading(false)
    if (q.length > 0) {
      setQuote(q[0])
      setEditSub(subCopy)
    } else {
      setError(`unable to load quote: ${item.symbol}`)
    }
  }
  const handleClose = () => {
    setQuote(null)
    setEditSub(null)
  }
  const handleSave = async (item: StockAlertTrigger) => {
    if (editSub && quote) {
      setIsLoading(true)
      await saveTrigger(username, editSub.id, quote, editSub, item)
      setIsLoading(false)
    }
    handleClose()
  }

  const handleDelete = (sub: StockAlertSubscription) => {
    setShowConfirmDelete(true)
    setEditSub(sub)
  }

  const handleYesDelete = async () => {
    if (editSub) {
      setIsLoading(true)
      await deleteRecord(editSub.id)
      setIsLoading(false)
    }
    handleCloseDelete()
    mutate(constructStockAlertsSubSecondaryKey(username))
  }

  const handleCloseDelete = async () => {
    setShowConfirmDelete(false)
    setEditSub(null)
  }

  const menuItems: ContextMenuItem[] = [
    {
      item: <ContextMenuEdit />,
      fn: (arg?: unknown) => {
        handleEdit(sub)
      },
    },
    {
      item: <ContextMenuDelete text={'delete'} />,
      fn: (arg?: unknown) => {
        handleDelete(sub)
      },
    },
  ]
  return (
    <TableRow>
      <TableCell colSpan={10}>
        <Box>
          {isLoading && <BackdropLoader />}
          {showConfirmDelete && editSub && (
            <ConfirmDeleteDialog onCancel={handleCloseDelete} onConfirm={handleYesDelete} show={true} text={`Delete subscription for ${editSub.symbol}?`} />
          )}
          {error && <Alert severity='error'>{error}</Alert>}
          {quote && editSub && <StockSubscriptionForm show={true} onClose={handleClose} onSave={handleSave} quote={quote} sub={editSub} />}
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
            <Box>
              <Clickable
                onClicked={() => {
                  router.push(`/csr/stocks/details?id=${sub.symbol}&returnUrl=/csr/stocks/alerts`)
                }}
              >
                <Typography variant='h6'>{`${sub.company} (${sub.symbol})`}</Typography>
              </Clickable>
            </Box>
            <Box>
              <ContextMenu items={menuItems} />
            </Box>
          </Box>
          {sub.triggers.map((trigger) => (
            <Box key={trigger.typeId} pt={1} display={'flex'} gap={1} flexDirection={'column'}>
              <Box>
                <Typography variant='body2'>{`${trigger.typeDescription}`}</Typography>
              </Box>
              <Box>
                <Typography variant='body2'>{`target: ${trigger.target}%`}</Typography>
              </Box>
              <Box>
                {trigger.message && (
                  <>
                    <AlertWithHeader severity='success' header={`${dayjs(trigger.executedDate).format('MM/DD/YYYY hh:mm A')}`} text={`${trigger.message}`} />
                  </>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </TableCell>
    </TableRow>
  )
}

export default StockAlertRow

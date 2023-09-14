import { Box, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAdd from 'components/Molecules/Menus/ContextMenuAdd'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import dayjs from 'dayjs'
import { StockPortfolio, StockPosition, StockTransaction, StockTransactionType } from 'lib/backend/api/aws/apiGateway'
import { usePortfolioHelper, Validation } from 'lib/ui/portfolio/usePortfolioHelper'
import numeral from 'numeral'
import React from 'react'
import { getPositiveNegativeColor } from '../StockListItem'
import AddTransactionForm, { TransactionFields } from './AddTransactionForm'
import EditTransactionForm from './EditTransactionForm'

const TransactionsTable = ({
  portfolio,
  position,
  onDeleteTransaction,
  onModifiedTransaction,
}: {
  portfolio: StockPortfolio
  position: StockPosition
  onDeleteTransaction: (item: StockTransaction) => void
  onModifiedTransaction: () => void
}) => {
  const theme = useTheme()
  const [confirmDeleteTransaction, setConfirmDeleteTransaction] = React.useState(false)
  const [showAddTransactionForm, setShowAddTransactionForm] = React.useState(false)
  const [editTransaction, setEditTransaction] = React.useState<StockTransaction | null>(null)
  const [validationResult, setValidationResult] = React.useState<Validation | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showDeletePositionConfirm, setShowDeletePositionConfirm] = React.useState(false)
  const { addTransaction, saveTransaction, deletePosition } = usePortfolioHelper(portfolio)

  const menu: ContextMenuItem[] = [
    {
      item: <ContextMenuAdd text='add transaction' />,
      fn: () => setShowAddTransactionForm(true),
    },
    {
      item: <ContextMenuDelete text='delete position' />,
      fn: () => setShowDeletePositionConfirm(true),
    },
  ]

  const getTransactionMenu = (tr: StockTransaction) => {
    const result: ContextMenuItem[] = []
    const hasClosingTransactions = position.transactions.filter((m) => m.isClosing).length > 0
    if (!hasClosingTransactions) {
      result.push({
        item: <ContextMenuEdit />,
        fn: () => setEditTransaction(tr),
      })
    }
    if (tr.isClosing || !hasClosingTransactions) {
      result.push({
        item: <ContextMenuDelete />,
        fn: () => setConfirmDeleteTransaction(true),
      })
    }
    return result
  }
  const handleDeleteTransaction = (tr: StockTransaction) => {
    setConfirmDeleteTransaction(false)
    onDeleteTransaction(tr)
  }
  const handleAddTransaction = async (data: TransactionFields) => {
    //setShowAddTransactionForm(false)
    const tr: StockTransaction = {
      id: crypto.randomUUID(),
      type: data.type as StockTransactionType,
      date: data.date,
      positionId: position.id,
      quantity: data.quantity,
      price: Number(data.price),
      status: 'open',
    }
    const result = await addTransaction(position, tr)
    if (result.isValid) {
      setValidationResult(null)
      setShowAddTransactionForm(false)
      onModifiedTransaction()
    } else {
      setValidationResult(result)
    }
  }
  const handleUpdateTransaction = async (data: TransactionFields) => {
    setIsLoading(true)
    const tr = { ...editTransaction! }
    if (tr) {
      tr.date = data.date
      tr.price = Number(data.price)
      tr.quantity = data.quantity
    }
    await saveTransaction(position, tr)
    //console.log(tr)
    setEditTransaction(null)
    setIsLoading(false)
    onModifiedTransaction()
    //setShowAddTransactionForm(false)
  }
  const handleDeletePosition = async () => {
    setShowDeletePositionConfirm(false)
    setIsLoading(true)
    await deletePosition(position)
    setIsLoading(false)
    onModifiedTransaction()
  }

  return (
    <Box pt={1}>
      {isLoading && <BackdropLoader />}
      {showAddTransactionForm ? (
        <Box p={2}>
          <AddTransactionForm
            position={position}
            onCancel={() => setShowAddTransactionForm(false)}
            onSubmitted={handleAddTransaction}
            error={validationResult && validationResult.messages.length > 0 ? validationResult.messages[0] : undefined}
          />
        </Box>
      ) : (
        <>
          {editTransaction ? (
            <Box p={2}>
              <EditTransactionForm transaction={editTransaction} onCancel={() => setEditTransaction(null)} onSubmitted={handleUpdateTransaction} />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={1}>
                      <Box display={'flex'} gap={1} alignItems={'center'}>
                        <Typography variant='caption'>open quantity:</Typography>
                        <Typography variant='caption'>{position.openQuantity}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell colSpan={2}>
                      <Box display={'flex'} gap={1} alignItems={'center'}>
                        <Typography variant='caption'>unrealized gain/loss:</Typography>
                        <Typography variant='caption' color={getPositiveNegativeColor(position.unrealizedGainLoss, theme.palette.mode)}>{`$${numeral(
                          position.unrealizedGainLoss,
                        ).format('0,0.00')}`}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell colSpan={10}></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>type</TableCell>
                    <TableCell>quantity</TableCell>
                    <TableCell>price</TableCell>
                    <TableCell>cost</TableCell>
                    <TableCell>{'value'}</TableCell>
                    <TableCell>gain</TableCell>
                    <TableCell>date</TableCell>
                    <TableCell>status</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <ContextMenu items={menu} />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {position.transactions.map((tr) => (
                    <TableRow key={tr.id}>
                      <TableCell>{tr.type}</TableCell>
                      <TableCell>{tr.quantity}</TableCell>
                      <TableCell>{`$${tr.price}`}</TableCell>
                      <TableCell>{`$${numeral(tr.cost).format('0,0.00')}`}</TableCell>
                      <TableCell>{`$${numeral(tr.value).format('0,0.00')}`}</TableCell>
                      <TableCell sx={{ color: getPositiveNegativeColor(tr.gainLoss, theme.palette.mode) }}>{`$${numeral(tr.gainLoss).format(
                        '0,0.00',
                      )}`}</TableCell>
                      <TableCell>{dayjs(tr.date).format('MM/DD/YYYY')}</TableCell>
                      <TableCell>{tr.status}</TableCell>

                      <TableCell sx={{ textAlign: 'right' }}>
                        <ContextMenu items={getTransactionMenu(tr)} />
                        <ConfirmDeleteDialog
                          text='Are you sure you want to delete this transaction'
                          show={confirmDeleteTransaction}
                          onCancel={() => setConfirmDeleteTransaction(false)}
                          onConfirm={() => handleDeleteTransaction(tr)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
      <ConfirmDeleteDialog
        show={showDeletePositionConfirm}
        onCancel={() => setShowDeletePositionConfirm(false)}
        onConfirm={handleDeletePosition}
        text={'Are you sure you want to delete this position?'}
      />
    </Box>
  )
}

export default TransactionsTable

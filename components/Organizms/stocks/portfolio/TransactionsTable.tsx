import { Box, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import { StockPosition, StockTransaction } from 'lib/backend/api/aws/apiGateway'
import numeral from 'numeral'
import React from 'react'
import AddTransactionForm, { TransactionFields } from './AddTransactionForm'

const TransactionsTable = ({
  position,
  transactions,
  onDeleteTransaction,
}: {
  position: StockPosition
  transactions: StockTransaction[]
  onDeleteTransaction: (item: StockTransaction) => void
}) => {
  const [confirmDeleteTransaction, setConfirmDeleteTransaction] = React.useState(false)
  const [showAdTransactionForm, setShowAddTransactionForm] = React.useState(false)
  const menu: ContextMenuItem[] = [
    {
      item: <ListItemText primary='add transaction'></ListItemText>,
      fn: () => setShowAddTransactionForm(true),
    },
  ]

  const calculateTrGainLoss = (tr: StockTransaction) => {
    if (!position.quote) {
      return 0
    }
    //console.log(numeral(tr.price * tr.quantity).format('0,0.00'))
    if (!tr.isClosing) {
      return position.quote.Price * tr.quantity - tr.price * tr.quantity
    }
    return 0
  }
  const getTransactionMenu = (tr: StockTransaction) => {
    const result: ContextMenuItem[] = []
    result.push({
      item: <ContextMenuEdit />,
      fn: () => {},
    })
    if (tr.isClosing || position.transactions.filter((m) => m.isClosing).length === 0) {
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
  const handleAddTransaction = (data: TransactionFields) => {
    setShowAddTransactionForm(false)
  }

  return (
    <Box pt={1}>
      {showAdTransactionForm ? (
        <Box p={2}>
          <AddTransactionForm position={position} onCancel={() => setShowAddTransactionForm(false)} onSubmitted={handleAddTransaction} />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>type</TableCell>
                <TableCell>quantity</TableCell>
                <TableCell>price</TableCell>
                <TableCell>total</TableCell>
                <TableCell>gain/loss</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <ContextMenu items={menu} />
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {transactions.map((tr) => (
                <TableRow key={tr.id}>
                  <TableCell>{tr.type}</TableCell>
                  <TableCell>{tr.quantity}</TableCell>
                  <TableCell>{`$${tr.price}`}</TableCell>
                  <TableCell>{`$${numeral(tr.price * tr.quantity).format('0,0.00')}`}</TableCell>
                  <TableCell>{`$${numeral(calculateTrGainLoss(tr)).format('0,0.00')}`}</TableCell>
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
    </Box>
  )
}

export default TransactionsTable

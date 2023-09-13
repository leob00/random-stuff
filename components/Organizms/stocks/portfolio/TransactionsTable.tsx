import { Box, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import dayjs from 'dayjs'
import { StockPortfolio, StockPosition, StockTransaction } from 'lib/backend/api/aws/apiGateway'
import numeral from 'numeral'
import React from 'react'
import { getPositiveNegativeColor } from '../StockListItem'
import AddTransactionForm, { TransactionFields } from './AddTransactionForm'

const TransactionsTable = ({
  portfolio,
  position,
  onDeleteTransaction,
}: {
  portfolio: StockPortfolio
  position: StockPosition
  onDeleteTransaction: (item: StockTransaction) => void
}) => {
  const theme = useTheme()
  const [confirmDeleteTransaction, setConfirmDeleteTransaction] = React.useState(false)
  const [showAdTransactionForm, setShowAddTransactionForm] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const menu: ContextMenuItem[] = [
    {
      item: <ListItemText primary='add transaction'></ListItemText>,
      fn: () => setShowAddTransactionForm(true),
    },
  ]

  const calculateTotalValue = (tr: StockTransaction) => {
    if (!position.quote) {
      return 0
    }
    if (!tr.isClosing) {
      return position.quote.Price * tr.quantity
    }
    return 0
  }
  const getTransactionMenu = (tr: StockTransaction) => {
    const result: ContextMenuItem[] = []
    const hasClosingTransactions = position.transactions.filter((m) => m.isClosing).length > 0
    if (!hasClosingTransactions) {
      result.push({
        item: <ContextMenuEdit />,
        fn: () => {},
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
                <TableCell colSpan={1}>
                  <Box display={'flex'} gap={1} alignItems={'center'}>
                    <Typography variant='caption'>open quantity:</Typography>
                    <Typography variant='caption'>{position.openQuantity}</Typography>
                  </Box>
                </TableCell>
                <TableCell colSpan={2}>
                  <Box display={'flex'} gap={1} alignItems={'center'}>
                    <Typography variant='caption'>unrealized gain/loss:</Typography>
                    <Typography variant='body1' color={getPositiveNegativeColor(position.unrealizedGainLoss, theme.palette.mode)}>{`$${numeral(
                      position.unrealizedGainLoss,
                    ).format('0,0.00')}`}</Typography>
                  </Box>
                </TableCell>
                <TableCell colSpan={10}></TableCell>
              </TableRow>
              <TableRow>
                {/* <TableCell>gain/loss</TableCell> */}

                <TableCell>type</TableCell>
                <TableCell>quantity</TableCell>
                <TableCell>price</TableCell>
                <TableCell>cost</TableCell>
                <TableCell>{'value'}</TableCell>
                <TableCell>date</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                  <ContextMenu items={menu} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {position.transactions.map((tr) => (
                <TableRow key={tr.id}>
                  {/* <TableCell>
                    {tr.gainLoss !== undefined && (
                      <Typography color={getPositiveNegativeColor(tr.gainLoss, theme.palette.mode)}>{`$${numeral(tr.gainLoss).format('0,0.00')}`}</Typography>
                    )}
                  </TableCell> */}
                  <TableCell>{tr.type}</TableCell>
                  <TableCell>{tr.quantity}</TableCell>
                  <TableCell>{`$${tr.price}`}</TableCell>
                  <TableCell>{`$${numeral(tr.cost).format('0,0.00')}`}</TableCell>
                  <TableCell>{`$${numeral(calculateTotalValue(tr)).format('0,0.00')}`}</TableCell>
                  <TableCell>{dayjs(tr.date).format('MM/DD/YYYY')}</TableCell>
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
            {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={1}>
                  <Box display={'flex'} gap={1}>
                    <Typography variant='caption'>open quantity:</Typography>
                    <Typography variant='caption'>{position.openQuantity}</Typography>
                  </Box>
                </TableCell>
                <TableCell colSpan={2}>
                  <Box display={'flex'} gap={1}>
                    <Typography variant='caption'>unrealized gain/loss:</Typography>
                    <Typography variant='caption' color={getPositiveNegativeColor(position.unrealizedGainLoss, theme.palette.mode)}>{`$${numeral(
                      position.unrealizedGainLoss,
                    ).format('0,0.00')}`}</Typography>
                  </Box>
                </TableCell>
                <TableCell colSpan={10}></TableCell>
              </TableRow>
            </TableFooter> */}
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default TransactionsTable

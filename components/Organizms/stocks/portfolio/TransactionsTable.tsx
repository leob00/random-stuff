import {
  Box,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAdd from 'components/Molecules/Menus/ContextMenuAdd'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import dayjs from 'dayjs'
import { StockPortfolio, StockPosition, StockTransaction, StockTransactionType } from 'lib/backend/api/aws/apiGateway/apiGateway'
import { usePortfolioHelper, Validation } from 'lib/ui/portfolio/usePortfolioHelper'
import numeral from 'numeral'
import React from 'react'
import { getPositiveNegativeColor } from '../StockListItem'
import AddTransactionForm, { TransactionFields } from './AddTransactionForm'
import EditTransactionForm from './EditTransactionForm'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import InfoDialog from 'components/Atoms/Dialogs/InfoDialog'
import ContextMenuMove from 'components/Molecules/Menus/ContextMenuMove'
import ConfirmDialog from 'components/Atoms/Dialogs/ConfirmDialog'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import { DropdownItem } from 'lib/models/dropdown'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import CenterStack from 'components/Atoms/CenterStack'
import { useRouter, usePathname } from 'next/navigation'

const TransactionsTable = ({
  allPortfolios,
  portfolio,
  position,
  onModifiedTransaction,
}: {
  allPortfolios: StockPortfolio[]
  portfolio: StockPortfolio
  position: StockPosition
  onModifiedTransaction: () => void
}) => {
  const theme = useTheme()
  const [confirmDeleteTransaction, setConfirmDeleteTransaction] = React.useState(false)
  const [showAddTransactionForm, setShowAddTransactionForm] = React.useState(false)
  const [editTransaction, setEditTransaction] = React.useState<StockTransaction | null>(null)
  const [validationResult, setValidationResult] = React.useState<Validation | null>(null)
  const [showDeletePositionConfirm, setShowDeletePositionConfirm] = React.useState(false)
  const [showTransactionEditInfoDialog, setShowTransactionEditInfoDialog] = React.useState(false)
  const { addTransaction, saveTransaction, deletePosition, deleteTransaction, isLoading, setIsLoading, updatePosition } = usePortfolioHelper(portfolio)
  const [movePosition, setMovePosition] = React.useState<StockPosition | null>(null)
  const router = useRouter()
  const path = usePathname()

  const getPositionsMenu = (position: StockPosition) => {
    const positionMenu: ContextMenuItem[] = [
      {
        item: <ContextMenuAdd text='add transaction' />,
        fn: () => setShowAddTransactionForm(true),
      },
      {
        item: <ContextMenuDelete text='delete position' />,
        fn: () => setShowDeletePositionConfirm(true),
      },
    ]
    if (allPortfolios.length > 1) {
      positionMenu.push({
        item: <ContextMenuMove text={'move position'} />,
        fn: () => setMovePosition(position),
      })
    }
    return positionMenu
  }

  const getTransactionMenu = (tr: StockTransaction) => {
    const result: ContextMenuItem[] = []
    const hasClosingTransactions = position.transactions.filter((m) => m.status === 'closed').length > 0
    if (!hasClosingTransactions) {
      result.push({
        item: <ContextMenuEdit />,
        fn: () => setEditTransaction(tr),
      })
    }
    if (tr.status === 'closed' || !hasClosingTransactions) {
      result.push({
        item: <ContextMenuDelete />,
        fn: () => setConfirmDeleteTransaction(true),
      })
    }
    if (result.length === 0) {
      result.push({
        item: (
          <>
            <ListItemIcon>
              <InfoOutlinedIcon color='primary' fontSize='small' />
            </ListItemIcon>
            <ListItemText primary={'info'} />
          </>
        ),
        fn: () => setShowTransactionEditInfoDialog(true),
      })
    }

    return result
  }
  const handleDeleteTransaction = async (tr: StockTransaction) => {
    setConfirmDeleteTransaction(false)
    setIsLoading(true)
    await deleteTransaction(position, tr)
    setIsLoading(false)
    onModifiedTransaction()
  }
  const handleAddTransaction = async (data: TransactionFields) => {
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
    setEditTransaction(null)
    setIsLoading(false)
    onModifiedTransaction()
  }
  const handleDeletePosition = async () => {
    setShowDeletePositionConfirm(false)
    setIsLoading(true)
    await deletePosition(position)
    setIsLoading(false)
    onModifiedTransaction()
  }
  const handleMovePosition = async () => {
    await updatePosition(movePosition!)
    setMovePosition(null)
    onModifiedTransaction()
    router.push('/csr/waitandredirect?id=csr/stocks/stock-porfolios')
  }
  const portfolioDropdown: DropdownItem[] = allPortfolios.map((m) => {
    return { text: m.name, value: m.id }
  })

  const handleChangePortfolio = async (val: string) => {
    const newPos = { ...movePosition!, portfolioId: val }
    setMovePosition(newPos)
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
                    <TableCell colSpan={10}>
                      <Box display={'flex'} gap={1} flexDirection={{ xs: 'column', sm: 'row' }}>
                        <Typography variant='caption'>open quantity:</Typography>
                        <Typography variant='caption'>{position.openQuantity}</Typography>
                        <Typography variant='caption'>unrealized gain/loss:</Typography>
                        <Typography variant='caption' color={getPositiveNegativeColor(position.unrealizedGainLoss, theme.palette.mode)}>{`$${numeral(
                          position.unrealizedGainLoss,
                        ).format('0,0.00')}`}</Typography>
                        <Typography variant='caption'>realized gain/loss:</Typography>
                        <Typography variant='caption' color={getPositiveNegativeColor(position.realizedGainLoss, theme.palette.mode)}>{`$${numeral(
                          position.realizedGainLoss,
                        ).format('0,0.00')}`}</Typography>
                      </Box>
                    </TableCell>
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
                      <ContextMenu items={getPositionsMenu(position)} />
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
      <InfoDialog
        show={showTransactionEditInfoDialog}
        title={'Unable to edit transaction'}
        onCancel={() => setShowTransactionEditInfoDialog(false)}
        fullScreen={false}
      >
        <Typography>
          This position contains closing transactions. Modifying this transaction will cause gain/loss miscalculations. Please delete all of the related closing
          transactions before editing this transaction.
        </Typography>
      </InfoDialog>
      <FormDialog show={movePosition !== null} title='move position' onCancel={() => setMovePosition(null)} onSave={handleMovePosition}>
        <Box>
          <Typography>You can move this position to another portfolio.</Typography>
          <Box py={2}>
            <CenterStack>
              <DropdownList options={portfolioDropdown} selectedOption={portfolio.id} onOptionSelected={handleChangePortfolio} />
            </CenterStack>
          </Box>
        </Box>
      </FormDialog>
    </Box>
  )
}

export default TransactionsTable

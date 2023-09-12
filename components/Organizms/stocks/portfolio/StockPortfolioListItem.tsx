import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import EditPortfolioForm, { PorfolioFields } from 'components/Molecules/Forms/Stocks/EditPortfolioForm'
import AddPositionForm, { PositionFields } from 'components/Molecules/Forms/Stocks/AddPositionForm'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { StockPortfolio, StockPosition, StockTransaction } from 'lib/backend/api/aws/apiGateway'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { usePortfolioHelper } from 'lib/ui/usePortfolioHelper'
import React from 'react'
import TransactionsTable from './TransactionsTable'
import { putRecord } from 'lib/backend/csr/nextApiWrapper'
import { constructStockPositionSecondaryKey } from 'lib/backend/api/aws/util'
import { getPorfolioIdFromKey, getUsernameFromKey } from 'lib/backend/api/portfolioUtil'

const StockPortfolioListItem = ({
  portfolio,
  editPortfolio,
  handleSavePortfolio,
  handleCancelEditPortfolio,
  handleEditPortfolio,
  handlePortfolioDelete,
  onMutate,
}: {
  portfolio: StockPortfolio
  editPortfolio: StockPortfolio | null
  handleSavePortfolio: (item: PorfolioFields) => void
  handleCancelEditPortfolio: () => void
  handleEditPortfolio: (item: StockPortfolio) => void
  handlePortfolioDelete: (item: StockPortfolio) => void
  onMutate: () => void
}) => {
  const [editedPosition, setEditedPosition] = React.useState<StockPosition | null>(null)
  const [showMore, setShowMore] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [positions, setPositions] = React.useState<StockPosition[]>([])
  const { addPosition, loadPositions, updatePosition } = usePortfolioHelper(portfolio)

  const handlePortfolioClick = (item: StockPortfolio) => {
    setShowMore((prev) => !prev)
  }

  const handleShowAddPostion = async (item: StockPortfolio) => {
    const pos: StockPosition = {
      portfolioId: item.id,
      id: `${item.id}position[${crypto.randomUUID()}]`,
      name: '',
      openQuantity: 0,
      type: 'long',
      stockSymbol: '',
      date: '',
      status: 'open',
      transactions: [],
    }
    setEditedPosition(pos)
    setShowMore(false)
  }
  const handleAddPosition = async (data: PositionFields) => {
    setIsLoading(true)
    setEditedPosition(null)
    await addPosition(data, editedPosition!)
    setShowMore(true)

    setIsLoading(false)
  }

  const loadData = async () => {
    setIsLoading(true)
    const records = await loadPositions()
    setPositions(records)
    setIsLoading(false)
  }
  const handlePositionClick = async (item: StockPosition) => {
    console.log(item)
  }
  const getHeaderText = (quote: StockQuote) => {
    return `${quote.Company} (${quote.Symbol})`
  }
  const handleDeleteTransaction = async (item: StockTransaction) => {
    const newPosition = [...positions].find((m) => m.id === item.positionId)
    if (newPosition) {
      setIsLoading(true)
      newPosition.transactions = newPosition.transactions.filter((m) => m.id !== item.id)
      await updatePosition(newPosition)
      setIsLoading(false)
      loadData()
    }
  }

  React.useEffect(() => {
    if (showMore) {
      loadData()
    }
  }, [showMore])
  return (
    <Box key={portfolio.id}>
      {isLoading && <BackdropLoader />}
      {editPortfolio !== null && editPortfolio.id === portfolio.id ? (
        <Box pt={1} pb={2}>
          <EditPortfolioForm obj={{ name: portfolio.name }} onSubmitted={handleSavePortfolio} onCancel={handleCancelEditPortfolio} />
        </Box>
      ) : (
        <Box>
          <ListHeader
            item={portfolio}
            text={portfolio.name}
            onClicked={handlePortfolioClick}
            onEdit={handleEditPortfolio}
            onDelete={handlePortfolioDelete}
            onAdd={handleShowAddPostion}
            addText='add position'
          />
          {editedPosition !== null ? (
            <Box pb={4} pt={2} px={2}>
              <AddPositionForm
                obj={{
                  symbol: editedPosition.stockSymbol,
                  quantity: editedPosition.openQuantity,
                  type: editedPosition.type,
                  price: '0.00',
                  date: editedPosition.date,
                }}
                onCancel={() => setEditedPosition(null)}
                onSubmitted={handleAddPosition}
              />
            </Box>
          ) : (
            <>
              {showMore && (
                <Box py={2} px={1}>
                  {positions.length === 0 && !isLoading && <NoDataFound message='this position is currently empty' />}
                  {positions.map((item) => (
                    <Box key={item.id}>
                      <ListHeader
                        item={item}
                        text={`${item.type}: ${item.quote ? getHeaderText(item.quote) : item.stockSymbol}`}
                        onClicked={() => handlePositionClick(item)}
                      />
                      <TransactionsTable position={item} transactions={item.transactions} onDeleteTransaction={handleDeleteTransaction} />
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  )
}

export default StockPortfolioListItem

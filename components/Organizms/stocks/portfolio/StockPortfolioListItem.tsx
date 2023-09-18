import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import EditPortfolioForm, { PorfolioFields } from 'components/Molecules/Forms/Stocks/EditPortfolioForm'
import AddPositionForm, { PositionFields } from 'components/Molecules/Forms/Stocks/AddPositionForm'
import { StockPortfolio, StockPosition } from 'lib/backend/api/aws/apiGateway'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { usePortfolioHelper, Validation } from 'lib/ui/portfolio/usePortfolioHelper'
import React from 'react'
import TransactionsTable from './TransactionsTable'
import QuickQuote from '../QuickQuote'
import PortfolioHeader from './PortfolioHeader'

const StockPortfolioListItem = ({
  allPortfolios,
  portfolio,
  handlePortfolioDelete,
  onMutate,
}: {
  allPortfolios: StockPortfolio[]
  portfolio: StockPortfolio
  handlePortfolioDelete: (item: StockPortfolio) => void
  onMutate: () => void
}) => {
  const [editedPosition, setEditedPosition] = React.useState<StockPosition | null>(null)
  const [showMore, setShowMore] = React.useState(false)
  const [positions, setPositions] = React.useState<StockPosition[]>([])
  const [editedPortfolio, setEditedPortfolio] = React.useState<StockPortfolio | null>(null)
  const [validationResult, setValidationResult] = React.useState<Validation | null>(null)
  const { addPosition, loadPositions, savePortfolio, isLoading, setIsLoading } = usePortfolioHelper(portfolio)

  const handleSavePortfolio = async (data: PorfolioFields) => {
    if (editedPortfolio) {
      setIsLoading(true)
      const item = { ...editedPortfolio, name: data.name }
      setEditedPortfolio(null)
      await savePortfolio(item)
      setIsLoading(false)
      onMutate()
    }

    setEditedPortfolio(null)
  }
  const handleEditPortfolio = (item: StockPortfolio) => {
    setEditedPortfolio(item)
  }
  const handleCancelEditPortfolio = () => {
    setEditedPortfolio(null)
  }

  const handlePortfolioClick = () => {
    setShowMore((prev) => !prev)
  }

  const handleShowAddPosition = async (item: StockPortfolio) => {
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
  const handleAddPosition = async (data: PositionFields, quote: StockQuote) => {
    setIsLoading(true)
    const newPosition = { ...editedPosition! }
    newPosition.quote = quote

    await addPosition(data, newPosition)
    setEditedPosition(null)
    setShowMore(true)
    setIsLoading(false)
  }

  const loadData = async () => {
    setIsLoading(true)
    const records = await loadPositions()
    setPositions(records)
    setIsLoading(false)
  }

  const handleModifiedTransaction = async () => {
    loadData()
  }

  React.useEffect(() => {
    if (showMore) {
      loadData()
    }
  }, [showMore])
  return (
    <Box key={portfolio.id}>
      {isLoading && <BackdropLoader />}
      {editedPortfolio !== null && editedPortfolio.id === portfolio.id ? (
        <Box pt={1} pb={2}>
          <EditPortfolioForm obj={{ name: portfolio.name }} onSubmitted={handleSavePortfolio} onCancel={handleCancelEditPortfolio} />
        </Box>
      ) : (
        <Box pb={1}>
          <PortfolioHeader
            portfolio={portfolio}
            onAddPosition={handleShowAddPosition}
            onClicked={handlePortfolioClick}
            onEdit={handleEditPortfolio}
            onDelete={handlePortfolioDelete}
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
                  {positions.map((position) => (
                    <Box key={position.id}>
                      {position.quote && (
                        <Box px={1}>
                          <QuickQuote
                            quote={position.quote}
                            prependCompanyName={`${position.type.substring(0, 1).toUpperCase()}${position.type.substring(1)}: `}
                          />
                        </Box>
                      )}
                      <Box pb={4}>
                        <TransactionsTable
                          allPortfolios={allPortfolios}
                          portfolio={portfolio}
                          position={position}
                          onModifiedTransaction={handleModifiedTransaction}
                        />
                      </Box>
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

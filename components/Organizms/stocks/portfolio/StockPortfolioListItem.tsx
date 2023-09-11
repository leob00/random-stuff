import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import EditPortfolioForm, { PorfolioFields } from 'components/Molecules/Forms/Stocks/EditPortfolioForm'
import EditPositionForm, { PositionFields } from 'components/Molecules/Forms/Stocks/EditPositionForm'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { StockPortfolio, StockPosition, StockPositionType } from 'lib/backend/api/aws/apiGateway'
import { constructDynamoKey, constructStockPositionSecondaryKey } from 'lib/backend/api/aws/util'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getPorfolioIdFromKey, getUsernameFromKey } from 'lib/backend/api/portfolioUtil'
import { putRecord, searchRecords } from 'lib/backend/csr/nextApiWrapper'
import { usePortfolioHelper } from 'lib/ui/usePortfolioHelper'
import { findTextBetweenBrackets } from 'lib/util/string.util'
import React from 'react'

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
  const { savePosition, loadPositions } = usePortfolioHelper(portfolio)

  const handlePortfolioClick = (item: StockPortfolio) => {
    setShowMore((prev) => !prev)
  }

  const handleShowAddPostion = async (item: StockPortfolio) => {
    const pos: StockPosition = {
      portfolioId: item.id,
      id: `[${item.id}]position[${crypto.randomUUID()}]`,
      name: '',
      openQuantity: 0,
      type: 'long',
      stockSymbol: '',
      date: '',
    }
    setEditedPosition(pos)
    setShowMore(false)
  }
  const handleAddPosition = async (data: PositionFields) => {
    setIsLoading(true)
    setEditedPosition(null)
    await savePosition(data, editedPosition!)
    setShowMore(true)

    setIsLoading(false)
  }

  const loadData = async () => {
    setIsLoading(true)
    const records = await loadPositions()
    setPositions(records)
    setIsLoading(false)
  }
  const getHeaderText = (quote: StockQuote) => {
    return `${quote.Company} (${quote.Symbol})`
  }

  React.useEffect(() => {
    if (showMore) {
      loadData()
    }
  }, [showMore])
  return (
    <Box key={portfolio.id}>
      {isLoading && <BackdropLoader />}
      {editPortfolio && editPortfolio.id === portfolio.id ? (
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
          {editedPosition ? (
            <Box pb={4} pt={2} px={2}>
              <EditPositionForm
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
                <Box py={2} px={2}>
                  {positions.map((item) => (
                    <Box key={item.id}>
                      <ListHeader item={item} text={`${item.type}: ${item.quote ? getHeaderText(item.quote) : item.stockSymbol}`} onClicked={() => {}} />
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

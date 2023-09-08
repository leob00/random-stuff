import { Box } from '@mui/material'
import EditPortfolioForm, { PorfolioFields } from 'components/Molecules/Forms/Stocks/EditPortfolioForm'
import EditPositionForm, { PositionFields } from 'components/Molecules/Forms/Stocks/EditPositionForm'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { StockPortfolio, StockPosition } from 'lib/backend/api/aws/apiGateway'
import { constructDymamoPrimaryKey } from 'lib/backend/api/aws/util'
import React from 'react'

const StockPortfolioListItem = ({
  portfolio,
  editPortfolio,
  handleSavePortfolio,
  handleCancelEditPortfolio,
  handlePortfolioClick,
  handleEditPortfolio,
  handlePortfolioDelete,
  onMutate,
}: {
  portfolio: StockPortfolio
  editPortfolio: StockPortfolio | null
  handleSavePortfolio: (item: PorfolioFields) => void
  handleCancelEditPortfolio: () => void
  handlePortfolioClick: (item: StockPortfolio) => void
  handleEditPortfolio: (item: StockPortfolio) => void
  handlePortfolioDelete: (item: StockPortfolio) => void
  onMutate: () => void
}) => {
  const [editedPosition, setEditedPosition] = React.useState<StockPosition | null>(null)
  const handleShowAddPostion = async (item: StockPortfolio) => {
    const pos: StockPosition = {
      portfolioId: item.id,
      id: `[${item.id}]position[${crypto.randomUUID()}]`,
      name: '',
      openQuantity: 0,
      type: 'long',
      stockSymbol: '',
    }
    setEditedPosition(pos)
  }
  const handleAddPosition = (data: PositionFields) => {
    const pos = { ...editedPosition, price: data.price }

    console.log(data)
  }
  return (
    <Box key={portfolio.id}>
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
                obj={{ symbol: '', quantity: 0, type: 'long', price: '0' }}
                onCancel={() => setEditedPosition(null)}
                onSubmitted={handleAddPosition}
              />
            </Box>
          ) : (
            <></>
          )}
        </Box>
      )}
    </Box>
  )
}

export default StockPortfolioListItem

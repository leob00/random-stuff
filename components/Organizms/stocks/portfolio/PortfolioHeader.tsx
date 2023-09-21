import { Box, Stack, Typography, useTheme } from '@mui/material'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAdd from 'components/Molecules/Menus/ContextMenuAdd'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import ContextMenuEdit from 'components/Molecules/Menus/ContextMenuEdit'
import ContextMenuMove from 'components/Molecules/Menus/ContextMenuMove'
import { ChartBackground, DarkBlue } from 'components/themes/mainTheme'
import { StockPortfolio } from 'lib/backend/api/aws/apiGateway'
import numeral from 'numeral'
import React from 'react'
import { getPositiveNegativeColor } from '../StockListItem'

const PortfolioHeader = ({
  allPortfolios,
  portfolio,
  onClicked,
  onEdit,
  onDelete,
  onAddPosition,
}: {
  allPortfolios: StockPortfolio[]
  portfolio: StockPortfolio
  onClicked: (item: StockPortfolio) => void
  onEdit: (tem: StockPortfolio) => void
  onDelete: (tem: StockPortfolio) => void
  onAddPosition: (tem: StockPortfolio) => void
}) => {
  const theme = useTheme()
  const portfolioMenu: ContextMenuItem[] = [
    {
      item: <ContextMenuEdit />,
      fn: () => {
        onEdit(portfolio)
      },
    },
    {
      item: <ContextMenuDelete />,
      fn: () => {
        onDelete(portfolio)
      },
    },
    {
      item: <ContextMenuAdd text={'add position'} />,
      fn: () => {
        onAddPosition(portfolio)
      },
    },
  ]

  return (
    <Stack sx={{ backgroundColor: theme.palette.mode === 'dark' ? DarkBlue : ChartBackground }} p={1}>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} px={1}>
        <Box
          width={'100%'}
          sx={{ cursor: 'pointer' }}
          onClick={(e) => {
            onClicked(portfolio)
          }}
        >
          <Box pb={1}>
            <Typography variant={'h4'}>{portfolio.name}</Typography>
          </Box>
          <Box display={'flex'} gap={1}>
            <Typography variant='body2'>Gain/Loss:</Typography>
            {portfolio.gainLoss !== undefined && (
              <Typography variant='body2' color={getPositiveNegativeColor(portfolio.gainLoss, theme.palette.mode)}>
                {numeral(portfolio.gainLoss).format('0,0.00')}
              </Typography>
            )}
          </Box>
        </Box>
        <Box>
          <ContextMenu items={portfolioMenu} />
        </Box>
      </Box>
    </Stack>
  )
}

export default PortfolioHeader

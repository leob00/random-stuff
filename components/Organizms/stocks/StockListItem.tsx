import { Box, Stack, Typography } from '@mui/material'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { CasinoBlack, CasinoRed, CasinoGreen } from 'components/themes/mainTheme'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'

const StockListItem = ({
  index,
  item,
  totalCount,
  onRemoveItem,
}: {
  index: number
  item: StockQuote
  totalCount: number
  onRemoveItem: (id: string) => void
}) => {
  //const [stockItem, setStockItem] = React.useState(item)

  const renderPositiveNegative = (val: number, formattedValue: string) => {
    let color = CasinoBlack
    if (val < 0) {
      color = CasinoRed
    } else if (val > 0) {
      color = CasinoGreen
    }
    return (
      <Typography variant='body1' sx={{ color: color, fontWeight: 600 }}>
        {formattedValue}
      </Typography>
    )
  }
  return (
    <Box key={index} pb={2}>
      <Box py={1}>
        <Stack direction='row'>
          <Box maxWidth={'75%'} pb={1} pt={1}>
            <LinkButton2 onClick={() => {}}>
              <Typography fontWeight={600}>{renderPositiveNegative(item.Change, `${item.Symbol}: ${item.Company}`)}</Typography>
            </LinkButton2>
          </Box>
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <Stack>{renderPositiveNegative(item.Change, `${item.Price.toFixed(2)}`)}</Stack>
          <Stack>{renderPositiveNegative(item.Change, `${item.Change.toFixed(2)}`)}</Stack>
          <Stack>{renderPositiveNegative(item.Change, `${item.ChangePercent.toFixed(2)}%`)}</Stack>
        </Stack>
      </Box>
      {index < totalCount - 1 && <HorizontalDivider />}
    </Box>
  )
}

export default StockListItem

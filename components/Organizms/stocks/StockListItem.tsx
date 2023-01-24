import { Box, Card, CardContent, CardHeader, ListItem, ListItemAvatar, Paper, Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import LinkButton2 from 'components/Atoms/Buttons/LinkButton2'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import {
  CasinoBlack,
  CasinoRed,
  CasinoGreen,
  CasinoBlackTransparent,
  CasinoBlue,
  CasinoGrayTransparent,
  CasinoLightGrayTransparent,
  CasinoLightPinkTransparent,
  VeryLightBlue,
  DarkBlue,
  DarkModeBlue,
  DarkBlueTransparent,
} from 'components/themes/mainTheme'
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

  const getPositiveNegativeColor = (val: number) => {
    let color = CasinoBlack
    if (val < 0) {
      color = '#980036'
    } else if (val > 0) {
      color = CasinoGreen
    }
    return color
  }

  const renderPositiveNegative = (val: number, formattedValue: string) => {
    const color = getPositiveNegativeColor(val)
    return (
      <Typography variant='h5' sx={{ color: color, fontWeight: 600 }}>
        {formattedValue}
      </Typography>
    )
  }
  return (
    <Box key={index} py={2}>
      {/* <Card>
        <CardContent>
          <LinkButton onClick={() => {}}>
            <Typography textAlign={'left'} fontWeight={600}>
              {`${item.Company} (${item.Symbol})`}
            </Typography>
          </LinkButton>
          <Stack direction={'row'} spacing={2} sx={{ backgroundColor: 'unset' }} pl={1}>
            <Stack>{renderPositiveNegative(item.Change, `${item.Price.toFixed(2)}`)}</Stack>
            <Stack>{renderPositiveNegative(item.Change, `${item.Change.toFixed(2)}`)}</Stack>
            <Stack>{renderPositiveNegative(item.Change, `${item.ChangePercent.toFixed(2)}%`)}</Stack>
          </Stack>
        </CardContent>
      </Card> */}
      <Paper sx={{ py: 1 }}>
        <Box>
          <Stack direction='row'>
            <Box sx={{ width: '100%', borderTopLeftRadius: '5px', borderTopRightRadius: '5px', backgroundColor: DarkBlueTransparent }} pl={1}>
              <LinkButton onClick={() => {}}>
                <Typography textAlign={'left'} variant='h6' color={VeryLightBlue}>
                  {`${item.Symbol}: ${item.Company}`}
                </Typography>
              </LinkButton>
            </Box>
          </Stack>
          <Stack direction={'row'} spacing={3} p={1} sx={{ backgroundColor: 'unset' }} pl={2}>
            <Stack>{renderPositiveNegative(item.Change, `$${item.Price.toFixed(2)}`)}</Stack>
            <Stack>{renderPositiveNegative(item.Change, `$${item.Change.toFixed(2)}`)}</Stack>
            <Stack>{renderPositiveNegative(item.Change, `${item.ChangePercent.toFixed(2)}%`)}</Stack>
          </Stack>
        </Box>
      </Paper>
      {/* {index < totalCount - 1 && <HorizontalDivider />} */}
    </Box>
  )
}

export default StockListItem

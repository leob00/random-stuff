import { Table, TableBody, TableRow, TableCell, Typography, Box, Stack, TableContainer, Grid } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import DraggableList from 'components/Molecules/Lists/DraggableList'
import StockListMenu from 'components/Molecules/Menus/StockListMenu'
import { CasinoBlack, CasinoBlackTransparent, CasinoGreen, CasinoRed } from 'components/themes/mainTheme'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'
import { DropResult } from 'react-beautiful-dnd'

const StockTable = ({ stockList, onRemoveItem }: { stockList: StockQuote[]; onRemoveItem: (id: string) => void }) => {
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
    <>
      <Box>
        {stockList.map((item, index) => (
          <Box key={index} pb={2} pl={1}>
            <Box py={1}>
              <Stack direction='row'>
                <Typography maxWidth={'75%'} fontWeight={600}>{`${item.Symbol}: ${item.Company}`}</Typography>
                <Stack alignItems={'flex-end'} flexGrow={1} pr={2}>
                  <StockListMenu id={item.Symbol} onRemoveItem={onRemoveItem} />
                </Stack>
              </Stack>

              <Stack direction={'row'} spacing={2}>
                <Stack>{renderPositiveNegative(item.Change, `${item.Price.toFixed(2)}`)}</Stack>
                <Stack>{renderPositiveNegative(item.Change, `${item.Change.toFixed(2)}`)}</Stack>
                <Stack>{renderPositiveNegative(item.Change, `${item.ChangePercent.toFixed(2)}%`)}</Stack>
              </Stack>
            </Box>
            {index < stockList.length - 1 && <HorizontalDivider />}
          </Box>
        ))}
      </Box>
    </>
  )
}

export default StockTable

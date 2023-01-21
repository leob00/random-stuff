import { Table, TableBody, TableRow, TableCell, Typography, Box, Stack, TableContainer, Grid } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import StockListMenu from 'components/Molecules/Menus/StockListMenu'
import { CasinoBlack, CasinoGreen, CasinoRed } from 'components/themes/mainTheme'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'

const StockTable = ({ stockList, onRemoveItem }: { stockList: StockQuote[]; onRemoveItem: (id: string) => void }) => {
  const renderPositiveNegative = (val: number, formattedValue: string) => {
    let color = CasinoBlack
    if (val < 0) {
      color = CasinoRed
    } else if (val > 0) {
      color = CasinoGreen
    }
    return (
      <Typography variant='body2' sx={{ color: color, fontWeight: 600 }}>
        {formattedValue}
      </Typography>
    )
  }

  return (
    <>
      <Box paddingLeft={{ xs: 0, sm: 6, md: 16, lg: 36 }} maxWidth={{ xs: '100%', md: '80%' }}>
        {stockList.map((item, index) => (
          <Box key={index} pb={2}>
            <Box py={1}>
              <Stack direction='row'>
                <Typography maxWidth={'75%'}>{`${item.Symbol}: ${item.Company}`}</Typography>
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
      <Box>
        {/*  <TableContainer>
          <Table>
            <TableBody>
              {stockList.map((item, index) => (
                <TableRow key={index}>
                  <TableCell valign='middle'>
                    <Typography>{`${item.Symbol}: ${item.Company}`}</Typography>
                  </TableCell>
                  <TableCell>{renderPositiveNegative(item.Change, `${item.Price.toFixed(2)}`)}</TableCell>
                  <TableCell>{renderPositiveNegative(item.Change, `${item.Change.toFixed(2)}`)}</TableCell>
                  <TableCell>{renderPositiveNegative(item.ChangePercent, `${item.ChangePercent.toFixed(2)}%`)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}
      </Box>
    </>
  )
}

export default StockTable

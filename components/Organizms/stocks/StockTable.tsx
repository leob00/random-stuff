import { Table, TableBody, TableRow, TableCell, Typography } from '@mui/material'
import { CasinoBlack, CasinoGreen, CasinoRed } from 'components/themes/mainTheme'
import { StockQuote } from 'lib/backend/api/models/zModels'
import React from 'react'

const StockTable = ({ stockList }: { stockList: StockQuote[] }) => {
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
    <Table sx={{ width: '80%' }}>
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
  )
}

export default StockTable

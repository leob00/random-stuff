import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import { SectorIndustry } from 'lib/backend/api/qln/qlnModels'
import numeral from 'numeral'
import React from 'react'
import { getPositiveNegativeColor } from './StockListItem'

const SectorsTable = ({ data }: { data: SectorIndustry[] }) => {
  const theme = useTheme()
  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell colSpan={5} align='center'>
                Moving Average
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align='right'>days:</TableCell>
              <TableCell align='center'>7</TableCell>
              <TableCell>30</TableCell>
              <TableCell>90</TableCell>
              <TableCell>180</TableCell>
              <TableCell>365</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.Name}>
                <TableCell>{item.Name}</TableCell>
                <TableCell>
                  <Typography color={getPositiveNegativeColor(item.MovingAvg[0].CurrentValue, theme.palette.mode)}>
                    {`${numeral(item.MovingAvg[0].CurrentValue).format('###,###0.00')}%`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color={getPositiveNegativeColor(item.MovingAvg[1].CurrentValue, theme.palette.mode)}>
                    {`${numeral(item.MovingAvg[1].CurrentValue).format('###,###0.00')}%`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color={getPositiveNegativeColor(item.MovingAvg[2].CurrentValue, theme.palette.mode)}>
                    {`${numeral(item.MovingAvg[2].CurrentValue).format('###,###0.00')}%`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color={getPositiveNegativeColor(item.MovingAvg[3].CurrentValue, theme.palette.mode)}>
                    {`${numeral(item.MovingAvg[3].CurrentValue).format('###,###0.00')}%`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color={getPositiveNegativeColor(item.MovingAvg[4].CurrentValue, theme.palette.mode)}>
                    {`${numeral(item.MovingAvg[4].CurrentValue).format('###,###0.00')}%`}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default SectorsTable

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import CenterStack from 'components/Atoms/CenterStack'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import React from 'react'
import StockListItem, { getPositiveNegativeColor } from './StockListItem'
import { Box, Typography } from '@mui/material'

const StockEarningsTable = ({ data }: { data: StockEarning[] }) => {
  return (
    <>
      <Box pl={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Actual</TableCell>
                <TableCell>Estimate</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography color={getPositiveNegativeColor(item.ActualEarnings)}>
                      {`${item.ActualEarnings ? numeral(item.ActualEarnings).format('0.00') : ''}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color={getPositiveNegativeColor(item.EstimatedEarnings)}>
                      {`${item.EstimatedEarnings ? numeral(item.EstimatedEarnings).format('0.00') : ''}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{dayjs(item.ReportDate).format('MM/DD/YYYY')}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {data.length === 0 && (
          <CenterStack sx={{ py: 4 }}>
            <Typography variant='body2'>No data found.</Typography>
          </CenterStack>
        )}
      </Box>
    </>
  )
}

export default StockEarningsTable

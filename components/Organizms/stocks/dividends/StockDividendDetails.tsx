import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { apiConnection } from 'lib/backend/api/config'
import { post } from 'lib/backend/api/fetchFunctions'
import { StockDividendItem } from 'lib/backend/api/qln/qlnModels'
import numeral from 'numeral'
import React from 'react'
import StockDividendsTable from '../StockDividendsTable'

const StockDividendDetails = ({ symbol }: { symbol: string }) => {
  const apiConn = apiConnection().qln
  const mutakeKey = `stockdividend-details ${symbol}`
  const dataFn = async () => {
    const resp = await post(`${apiConn.url}/StockDividends`, { Symbol: symbol })
    const result = resp.Body as StockDividendItem[]
    return result
  }
  const { data, isLoading } = useSwrHelper(mutakeKey, dataFn, { revalidateOnFocus: false })
  console.log(data)

  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      {data && (
        <>
          {data.length > 0 && (
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <Typography variant='h5'>{`${data[0].CompanyName} (${data[0].Symbol})`}</Typography>
              <Typography variant='h6'>{`Annual yield: ${data[0].AnnualYield}%`}</Typography>
            </Box>
          )}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>amount</TableCell>
                  <TableCell>ex date</TableCell>
                  <TableCell>payment date</TableCell>
                  <TableCell>frequency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={`${item.Symbol}${item.PaymentDate}`}>
                    <TableCell>{`$${numeral(item.Amount).format('0.000')}`}</TableCell>
                    <TableCell>{dayjs(item.ExDate).format('MM/DD/YYYY')}</TableCell>
                    <TableCell>{dayjs(item.PaymentDate).format('MM/DD/YYYY')}</TableCell>
                    <TableCell>{item.Frequency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  )
}

export default StockDividendDetails

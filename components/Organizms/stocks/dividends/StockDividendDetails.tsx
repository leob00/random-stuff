import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import numeral from 'numeral'
import React from 'react'
import { StockDividendItem } from '../StockDividendsTable'
import { QlnApiRequest, serverPostFetch } from 'lib/backend/api/qln/qlnApi'

const StockDividendDetails = ({ symbol }: { symbol: string }) => {
  const mutakeKey = `stockdividend-details ${symbol}`
  const dataFn = async () => {
    const req: QlnApiRequest = {
      key: symbol,
    }

    const resp = await serverPostFetch(req, '/DividendPayers')
    const result = resp.Body as StockDividendItem[]
    return result
  }
  const { data, isLoading } = useSwrHelper(mutakeKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      {data && (
        <>
          {data.length > 0 && (
            <Box display={'flex'} flexDirection={'column'} gap={2}>
              <CenterStack>
                <Typography variant='h4'>{`${data[0].CompanyName} (${data[0].Symbol})`}</Typography>
              </CenterStack>
              <CenterStack>
                <Typography variant='h5'>{`Annual yield: ${data[0].AnnualYield}%`}</Typography>
              </CenterStack>
              {/* <CenterStack>
                <Typography variant='h5'>{`Amount: $${numeral(data[0].Amount).format('0.000')}`}</Typography>
              </CenterStack> */}
            </Box>
          )}
          <Box pt={2}>
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
          </Box>
        </>
      )}
    </Box>
  )
}

export default StockDividendDetails

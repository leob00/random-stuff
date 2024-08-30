import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import numeral from 'numeral'
import React from 'react'
import { QlnApiRequest, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import { StockDividendItem } from './StockDividendsTable'
import { useClientPager } from 'hooks/useClientPager'
import Pager from 'components/Atoms/Pager'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const StockDividendDetails = ({ symbol, showCompanyName = true }: { symbol: string; showCompanyName?: boolean }) => {
  const pageSize = 4
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
  const { pagerModel, setPage, getPagedItems, reset } = useClientPager(data ?? [], pageSize)
  const items = getPagedItems(data ?? [])

  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
  }

  return (
    <Box py={2} minHeight={250}>
      {isLoading && <BackdropLoader />}
      {data && (
        <>
          {items.length > 0 && (
            <Box display={'flex'} flexDirection={'column'} gap={2}>
              {showCompanyName && (
                <CenterStack>
                  <Typography variant='h4'>{`${data[0].CompanyName} (${data[0].Symbol})`}</Typography>
                </CenterStack>
              )}
              <CenterStack>
                <Typography variant='h6'>{`Annual yield: ${data[0].AnnualYield}%`}</Typography>
              </CenterStack>
            </Box>
          )}
          <Box pt={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>amount</TableCell>
                    <TableCell>payment date</TableCell>
                    <TableCell>ex date</TableCell>
                    <TableCell>frequency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={`${item.Symbol}${item.PaymentDate}`}>
                      <TableCell>{`$${numeral(item.Amount).format('0.000')}`}</TableCell>
                      <TableCell>{dayjs(item.PaymentDate).format('MM/DD/YYYY')}</TableCell>
                      <TableCell>{dayjs(item.ExDate).format('MM/DD/YYYY')}</TableCell>
                      <TableCell>{item.Frequency}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Pager
            pageCount={pagerModel.totalNumberOfPages}
            itemCount={items.length}
            itemsPerPage={pageSize}
            onPaged={(pageNum: number) => handlePaged(pageNum)}
            defaultPageIndex={pagerModel.page}
            totalItemCount={pagerModel.totalNumberOfItems}
            showHorizontalDivider={false}
          ></Pager>
          <HorizontalDivider />
        </>
      )}
    </Box>
  )
}

export default StockDividendDetails

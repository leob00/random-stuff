import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import CenterStack from 'components/Atoms/CenterStack'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import React from 'react'
import { getPositiveNegativeColor } from './StockListItem'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material'
import { getPagedArray } from 'lib/util/collections'
import Pager from 'components/Atoms/Pager'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import { useRouter } from 'next/router'
import StockChange from './StockChange'
import Clickable from 'components/Atoms/Containers/Clickable'

const StockEarningsCalendarDetails = ({
  data,
  currentPageIndex,
  onPaged,
  onSearched,
}: {
  data: StockEarning[]
  currentPageIndex: number
  onPaged: (pageNum: number) => void
  onSearched: () => void
}) => {
  const theme = useTheme()
  const pageSize = 10
  const [searchWithinList, setSearchWithinList] = React.useState('')
  const router = useRouter()

  const filterList = () => {
    if (searchWithinList.length === 0) {
      return [...data]
    }
    return data.filter(
      (f) => f.Symbol.toLowerCase().startsWith(searchWithinList.toLowerCase()) || f.StockQuote?.Company.toLowerCase().includes(searchWithinList.toLowerCase()),
    )
  }
  const pages = getPagedArray(filterList(), pageSize)

  const handleSearched = (text: string) => {
    onSearched()
    setSearchWithinList(text)
  }

  React.useEffect(() => {
    //setPages(getPagedArray(filterList(data), pageSize))
  }, [searchWithinList])

  return (
    <>
      <Box pl={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={4}>
                  <SearchWithinList onChanged={handleSearched} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Actual</TableCell>
                <TableCell>Estimate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pages.length > 0 &&
                pages[currentPageIndex - 1].items.map((item, index) => (
                  <TableRow key={item.Symbol}>
                    <TableCell>
                      <Box>
                        <Clickable
                          onClicked={() => {
                            router.push(`/csr/stocks/details?id=${item.Symbol}&returnUrl=/csr/my-stocks?tab=Earnings`)
                          }}
                        >
                          <Typography px={2} variant='h5'>{`${item.StockQuote?.Company} (${item.StockQuote?.Symbol})`}</Typography>
                        </Clickable>
                      </Box>
                      {item.StockQuote && <StockChange item={item.StockQuote} />}
                    </TableCell>
                    <TableCell>
                      <Typography
                        color={getPositiveNegativeColor(item.ActualEarnings, theme.palette.mode)}
                      >{`${item.ActualEarnings ? numeral(item.ActualEarnings).format('0.00') : ''}`}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color={getPositiveNegativeColor(item.EstimatedEarnings, theme.palette.mode)}
                      >{`${item.EstimatedEarnings ? numeral(item.EstimatedEarnings).format('0.00') : ''}`}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {pages.length > 0 && (
          <Box pt={4}>
            <Pager
              pageCount={pages.length}
              itemCount={pages[currentPageIndex - 1].items.length}
              itemsPerPage={pageSize}
              onPaged={(pageNum: number) => onPaged(pageNum)}
              defaultPageIndex={currentPageIndex}
              totalItemCount={pages.length === 1 ? pages[currentPageIndex - 1].items.length : data.length}
            ></Pager>
          </Box>
        )}
        {data.length === 0 && (
          <CenterStack sx={{ py: 4 }}>
            <Typography variant='body2'>No data found.</Typography>
          </CenterStack>
        )}
      </Box>
    </>
  )
}

export default StockEarningsCalendarDetails

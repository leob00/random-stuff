import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import CenterStack from 'components/Atoms/CenterStack'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import { getPositiveNegativeColor } from '../StockListItem'
import { Box, Checkbox, Typography } from '@mui/material'
import { useTheme } from '@mui/material'
import { getPagedArray } from 'lib/util/collections'
import Pager from 'components/Atoms/Pager'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import { useRouter } from 'next/router'
import StockChange from '../StockChange'
import Clickable from 'components/Atoms/Containers/Clickable'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { ChangeEvent, useState } from 'react'
import NoDataFound from 'components/Atoms/Text/NoDataFound'

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
  const [searchWithinList, setSearchWithinList] = useState('')
  const [filterActual, setFilterActual] = useState(false)
  const [filterEstimate, setFilterEstimate] = useState(false)
  const router = useRouter()

  const filterList = () => {
    let result = [...data]
    if (searchWithinList.length > 0) {
      result = result.filter(
        (f) =>
          f.Symbol.toLowerCase().startsWith(searchWithinList.toLowerCase()) || f.StockQuote?.Company.toLowerCase().includes(searchWithinList.toLowerCase()),
      )
    }
    if (filterActual) {
      result = result.filter((m) => !!m.ActualEarnings)
    }
    if (filterEstimate) {
      result = result.filter((m) => !!m.EstimatedEarnings)
    }
    return result
  }
  const filtered = filterList()
  const pages = getPagedArray(filtered, pageSize)

  const handleSearched = (text: string) => {
    onSearched()
    setSearchWithinList(text)
  }

  const handleFilterActual = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onPaged(1)
    setFilterActual(checked)
  }
  const handleFilterEstimate = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onPaged(1)
    setFilterEstimate(checked)
  }

  return (
    <>
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <SearchWithinList onChanged={handleSearched} />
                </TableCell>
                <TableCell>
                  <Box display={'flex'} alignItems={'center'}>
                    <Box>
                      <Checkbox size='small' onChange={handleFilterActual} />
                    </Box>
                    <Box>Actual</Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display={'flex'} alignItems={'center'}>
                    <Box>
                      <Checkbox size='small' onChange={handleFilterEstimate} />
                    </Box>
                    <Box>Estimate</Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pages.length > 0 ? (
                pages[currentPageIndex - 1].items.map((item, index) => (
                  <TableRow key={item.Symbol}>
                    <TableCell sx={{ minWidth: '80%' }}>
                      <FadeIn>
                        <Box>
                          <Clickable
                            onClicked={() => {
                              router.push(`/csr/stocks/details/${item.Symbol}`)
                            }}
                          >
                            <Typography px={2} variant='h6'>{`${item.StockQuote?.Company} (${item.StockQuote?.Symbol})`}</Typography>
                          </Clickable>
                        </Box>
                        {item.StockQuote && <StockChange item={item.StockQuote} />}
                      </FadeIn>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                      <FadeIn>
                        <Typography color={getPositiveNegativeColor(item.ActualEarnings, theme.palette.mode)}>
                          {`${item.ActualEarnings ? numeral(item.ActualEarnings).format('0.00') : ''}`}
                        </Typography>
                      </FadeIn>
                    </TableCell>
                    <TableCell sx={{ verticalAlign: 'top' }}>
                      <FadeIn>
                        <Typography
                          color={getPositiveNegativeColor(item.EstimatedEarnings, theme.palette.mode)}
                        >{`${item.EstimatedEarnings ? numeral(item.EstimatedEarnings).format('0.00') : ''}`}</Typography>
                      </FadeIn>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={100}>
                    <FadeIn>
                      <NoDataFound message='no results' />
                    </FadeIn>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {pages.length > 1 && (
          <Box pt={4}>
            <Pager
              pageCount={pages.length}
              itemCount={pages[currentPageIndex - 1].items.length}
              itemsPerPage={pageSize}
              onPaged={(pageNum: number) => onPaged(pageNum)}
              defaultPageIndex={currentPageIndex}
              totalItemCount={pages.length === 1 ? pages[currentPageIndex - 1].items.length : filtered.length}
            ></Pager>
          </Box>
        )}
        {filtered.length === 0 && (
          <CenterStack sx={{ py: 4 }}>
            <Typography variant='body2'>No data found.</Typography>
          </CenterStack>
        )}
      </Box>
    </>
  )
}

export default StockEarningsCalendarDetails

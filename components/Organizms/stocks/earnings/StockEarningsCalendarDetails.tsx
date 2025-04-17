import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import CenterStack from 'components/Atoms/CenterStack'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import { Box, Checkbox, Typography } from '@mui/material'
import { getPagedArray } from 'lib/util/collections'
import Pager from 'components/Atoms/Pager'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import StockChange from '../StockChange'
import Clickable from 'components/Atoms/Containers/Clickable'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { ChangeEvent, useEffect, useState } from 'react'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import StockEarningsNumberDisplay from './StockEarningsNumberDisplay'
import StockEarningsCompanyDisplay from './StockEarningsCompanyDisplay'
import HoverEffect from 'components/Molecules/Lists/HoverEffect'

const StockEarningsCalendarDetails = ({
  data,
  currentPageIndex,
  onPaged,
  onSearched,
  onItemClicked,
  showFilters = true,
  pageSize = 10,
  maxHeight,
}: {
  data: StockEarning[]
  currentPageIndex: number
  onPaged: (pageNum: number) => void
  onSearched: () => void
  onItemClicked?: (symbol: string) => void
  showFilters?: boolean
  pageSize?: number
  maxHeight?: number
}) => {
  const [searchWithinList, setSearchWithinList] = useState('')
  const [filterActual, setFilterActual] = useState(false)
  const [filterEstimate, setFilterEstimate] = useState(false)
  const scroller = useScrollTop(0)

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

  const handlePaged = (pageNum: number) => {
    scroller.scroll()
    onPaged(pageNum)
  }

  const handleFilterActual = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFilterActual(checked)
  }
  const handleFilterEstimate = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    handlePaged(1)
    setFilterEstimate(checked)
  }

  const handleItemClick = async (symbol: string) => {
    onItemClicked?.(symbol)
  }
  useEffect(() => {
    scroller.scroll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <>
      <ScrollableBox scroller={scroller} maxHeight={maxHeight}>
        <Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{showFilters && <SearchWithinList onChanged={handleSearched} />}</TableCell>
                  <TableCell>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box>{showFilters && <Checkbox size='small' onChange={handleFilterActual} />}</Box>
                      <Box>Actual</Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box>{showFilters && <Checkbox size='small' onChange={handleFilterEstimate} />}</Box>
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
                        <Box>
                          <HoverEffect>
                            <Clickable
                              onClicked={() => {
                                handleItemClick(item.Symbol)
                              }}
                            >
                              <StockEarningsCompanyDisplay item={item} />
                            </Clickable>
                          </HoverEffect>
                        </Box>
                        {item.StockQuote && <StockChange item={item.StockQuote} />}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'top' }}>
                        <StockEarningsNumberDisplay num={item.ActualEarnings} />
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'top' }}>
                        <StockEarningsNumberDisplay num={item.EstimatedEarnings} />
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

          {filtered.length === 0 && (
            <CenterStack sx={{ py: 4 }}>
              <Typography variant='body2'>No data found.</Typography>
            </CenterStack>
          )}
        </Box>
      </ScrollableBox>
      {pages.length > 1 && (
        <Box pt={4}>
          <Pager
            pageCount={pages.length}
            itemCount={pages[currentPageIndex - 1].items.length}
            itemsPerPage={pageSize}
            onPaged={(pageNum: number) => handlePaged(pageNum)}
            defaultPageIndex={currentPageIndex}
            totalItemCount={pages.length === 1 ? pages[currentPageIndex - 1].items.length : filtered.length}
          ></Pager>
        </Box>
      )}
    </>
  )
}

export default StockEarningsCalendarDetails

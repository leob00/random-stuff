import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import { Sort } from 'lib/backend/api/aws/models/apiGatewayModels'
import { SectorIndustry } from 'lib/backend/api/qln/qlnModels'
import { sortArray } from 'lib/util/collections'
import numeral from 'numeral'
import React from 'react'
import { getPositiveNegativeColor } from './StockListItem'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import SortableHeaderCell from 'components/Atoms/Tables/SortableHeader'
import Clickable from 'components/Atoms/Containers/Clickable'
import { useRouter } from 'next/router'
import { usePager } from 'hooks/usePager'
import Pager from 'components/Atoms/Pager'

interface Model {
  Id: string
  Name: string
  Category: string
  MovingAvg7: number
  MovingAvg30: number
  MovingAvg90: number
  MovingAvg180: number
  MovingAvg365: number
}

const SectorsTable = ({ data }: { data: SectorIndustry[] }) => {
  const pageSize = 10
  const router = useRouter()
  const theme = useTheme()
  const defaultSort: Sort = {
    key: 'MovingAvg30',
    direction: 'desc',
  }
  const model = mapModel(data, defaultSort)
  const [sort, setSort] = React.useState(defaultSort)

  const pager = usePager(model, pageSize)
  const modelItems = pager.displayItems as Model[]

  const handleChangeSort = (newSort: Sort) => {
    setSort(newSort)
    const newResults = mapModel(data, newSort)
    pager.reset(newResults)
  }
  const handleItemClick = async (item: Model) => {
    console.log(`/csr/stocks/sectors/${item.Id}`)
    router.push(`/csr/stocks/sectors/${item.Id}`)
  }
  const handlePaged = (pageNum: number) => {
    pager.setPage(pageNum)
  }

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
              <SortableHeaderCell displayText='7' fieldName='MovingAvg7' sort={sort} onChangeSort={handleChangeSort} />
              <SortableHeaderCell displayText='30' fieldName='MovingAvg30' sort={sort} onChangeSort={handleChangeSort} />
              <SortableHeaderCell displayText='90' fieldName='MovingAvg90' sort={sort} onChangeSort={handleChangeSort} />
              <SortableHeaderCell displayText='180' fieldName='MovingAvg180' sort={sort} onChangeSort={handleChangeSort} />
              <SortableHeaderCell displayText='365' fieldName='MovingAvg365' sort={sort} onChangeSort={handleChangeSort} />
            </TableRow>
          </TableHead>
          <TableBody>
            {modelItems.map((item) => (
              <TableRow key={item.Name}>
                <TableCell>
                  <Clickable onClicked={() => handleItemClick(item)}>{item.Name} </Clickable>
                </TableCell>
                <TableCell>
                  <Typography color={getPositiveNegativeColor(item.MovingAvg7, theme.palette.mode)}>
                    {`${numeral(item.MovingAvg7).format('###,###0.00')}%`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color={getPositiveNegativeColor(item.MovingAvg30, theme.palette.mode)}>
                    {`${numeral(item.MovingAvg30).format('###,###0.00')}%`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display={'flex'} alignItems={'center'} gap={1}>
                    <Typography color={getPositiveNegativeColor(item.MovingAvg90, theme.palette.mode)}>
                      {`${numeral(item.MovingAvg90).format('###,###0.00')}%`}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography color={getPositiveNegativeColor(item.MovingAvg180, theme.palette.mode)}>
                    {`${numeral(item.MovingAvg180).format('###,###0.00')}%`}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color={getPositiveNegativeColor(item.MovingAvg365, theme.palette.mode)}>
                    {`${numeral(item.MovingAvg365).format('###,###0.00')}%`}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pager
        pageCount={pager.pageCount}
        itemCount={pager.displayItems.length}
        itemsPerPage={pageSize}
        onPaged={(pageNum: number) => handlePaged(pageNum)}
        defaultPageIndex={pager.page}
        totalItemCount={pager.allItems.length}
        showHorizontalDivider={false}
      ></Pager>
    </Box>
  )
}

function mapModel(results: SectorIndustry[], sort: Sort) {
  const result: Model[] = results.map((m) => {
    return {
      Id: m.ContainerId,
      Category: m.Category,
      Name: m.Name,
      MovingAvg7: m.MovingAvg[0].CurrentValue,
      MovingAvg30: m.MovingAvg[1].CurrentValue,
      MovingAvg90: m.MovingAvg[2].CurrentValue,
      MovingAvg180: m.MovingAvg[3].CurrentValue,
      MovingAvg365: m.MovingAvg[4].CurrentValue,
    }
  })

  return sortArray(result, [sort.key], [sort.direction])
}

export default SectorsTable
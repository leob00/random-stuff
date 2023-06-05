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
import { uniq } from 'lodash'

interface GroupedModel {
  key: string
  items: StockEarning[]
}

const StockEarningsTable = ({ data }: { data: StockEarning[] }) => {
  const yearsGroup: GroupedModel[] = []
  const years = uniq(data.filter((f) => f.ReportDate).map((m) => dayjs(m.ReportDate).format('YYYY')))
  years.forEach((year) => {
    yearsGroup.push({
      key: year,
      items: data.filter((m) => dayjs(m.ReportDate).format('YYYY') === year),
    })
  })

  return (
    <>
      <Box pl={1}>
        <TableContainer component={Paper}>
          <Table>
            {/* <TableHead>
              <TableRow>
                <TableCell>Actual</TableCell>
                <TableCell>Estimate</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead> */}
            <TableBody>
              {yearsGroup.map((item, index) => (
                <TableRow key={item.key}>
                  <TableCell colSpan={10} sx={{ borderBottom: 'none' }}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>{item.key}</TableCell>
                            <TableCell>Actual</TableCell>
                            <TableCell>Estimate</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {item.items.map((subItem, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <Typography>{dayjs(subItem.ReportDate).format('MM/DD/YYYY')}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography color={getPositiveNegativeColor(subItem.ActualEarnings)}>
                                  {`${subItem.ActualEarnings ? numeral(subItem.ActualEarnings).format('0.00') : ''}`}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography color={getPositiveNegativeColor(subItem.EstimatedEarnings)}>
                                  {`${subItem.EstimatedEarnings ? numeral(subItem.EstimatedEarnings).format('0.00') : ''}`}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TableCell>
                </TableRow>

                // <TableRow key={index}>
                //   <TableCell>
                //     <Typography color={getPositiveNegativeColor(item.ActualEarnings)}>
                //       {`${item.ActualEarnings ? numeral(item.ActualEarnings).format('0.00') : ''}`}
                //     </Typography>
                //   </TableCell>
                //   <TableCell>
                //     <Typography color={getPositiveNegativeColor(item.EstimatedEarnings)}>
                //       {`${item.EstimatedEarnings ? numeral(item.EstimatedEarnings).format('0.00') : ''}`}
                //     </Typography>
                //   </TableCell>
                //   <TableCell>
                //     <Typography>{dayjs(item.ReportDate).format('MM/DD/YYYY')}</Typography>
                //   </TableCell>
                // </TableRow>
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

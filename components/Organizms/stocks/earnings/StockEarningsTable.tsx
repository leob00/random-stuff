import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import React from 'react'
import { getPositiveNegativeColor } from '../StockListItem'
import { Box, Typography } from '@mui/material'
import { uniq } from 'lodash'
import { useTheme } from '@mui/material'
import NoDataFound from 'components/Atoms/Text/NoDataFound'

interface GroupedModel {
  key: string
  items: StockEarning[]
}

const StockEarningsTable = ({ data, showCompany = false }: { data: StockEarning[]; showCompany?: boolean }) => {
  const theme = useTheme()
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
                                {showCompany ? (
                                  <Typography>{`${subItem.StockQuote?.Company} (${subItem.StockQuote?.Symbol})`}</Typography>
                                ) : (
                                  <Typography>{dayjs(subItem.ReportDate).format('MM/DD/YYYY')}</Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Typography color={getPositiveNegativeColor(subItem.ActualEarnings, theme.palette.mode)}>
                                  {`${subItem.ActualEarnings !== null ? numeral(subItem.ActualEarnings).format('0.00') : ''}`}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography color={getPositiveNegativeColor(subItem.EstimatedEarnings, theme.palette.mode)}>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {data.length === 0 && <NoDataFound />}
      </Box>
    </>
  )
}

export default StockEarningsTable

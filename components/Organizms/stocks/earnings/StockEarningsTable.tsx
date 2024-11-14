import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import CenterStack from 'components/Atoms/CenterStack'
import dayjs from 'dayjs'
import { StockEarning, StockEarningAggregate } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import React, { useState } from 'react'
import { getPositiveNegativeColor } from '../StockListItem'
import { Box, Button, Typography } from '@mui/material'
import { sum, uniq } from 'lodash'
import { useTheme } from '@mui/material'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import RecentEarningsReport from './RecentEarningsReport'
import AnnualEarningsReport from './AnnualEarningsReport'
import { sortArray } from 'lib/util/collections'
import QuarterlyEarningsReport from './QuarterlyEarningsReport'

interface GroupedModel {
  key: number
  items: StockEarning[]
}

const StockEarningsTable = ({ data, showCompany = false }: { data: StockEarning[]; showCompany?: boolean }) => {
  const theme = useTheme()
  const yearsGroup: GroupedModel[] = []
  const [showChart, setShowChart] = useState(false)

  const years = uniq(data.filter((f) => f.ReportDate).map((m) => dayjs(m.ReportDate).year()))
  years.forEach((year) => {
    yearsGroup.push({
      key: year,
      items: data.filter((m) => dayjs(m.ReportDate).year() === year),
    })
  })
  const sortedYears = sortArray(yearsGroup, ['key'], ['asc'])

  // const annualData: StockEarningAggregate[] = sortedYears.map((m, i) => {
  //   return {
  //     NegativeCount: m.items.filter((i) => i.ActualEarnings && i.ActualEarnings < 0).length,
  //     PositiveCount: m.items.filter((i) => i.ActualEarnings && i.ActualEarnings > 0).length,
  //     NeutralCount: m.items.filter((i) => i.ActualEarnings && i.ActualEarnings == 0).length,
  //     Quarter: i,
  //     RecordCount: m.items.length,
  //     Year: Number(m.key),
  //   }
  // })

  const annualData: StockEarningAggregate[] = []
  sortedYears.forEach((year) => {
    const quarters = new Set<number>()
    year.items.forEach((item) => {
      quarters.add(dayjs(item.ReportDate!).quarter())
    })
    Array.from(quarters).forEach((q) => {
      const qItems = year.items.filter((m) => dayjs(m.ReportDate!).year() === year.key && dayjs(m.ReportDate!).quarter() === q)
      if (qItems.length > 0) {
        annualData.push({
          NegativeCount: qItems.filter((m) => m.ActualEarnings && m.ActualEarnings < 0).length,
          NeutralCount: qItems.filter((m) => m.ActualEarnings && m.ActualEarnings == 0).length,
          PositiveCount: qItems.filter((m) => m.ActualEarnings && m.ActualEarnings > 0).length,
          RecordCount: qItems.length,
          Quarter: q,
          Year: year.key,
        })
      }
    })
  })
  console.log(annualData)

  return (
    <>
      <Box pl={1}>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button onClick={() => setShowChart(!showChart)}>{showChart ? 'view table' : 'view chart'}</Button>
        </Box>
        {!showChart && (
          <TableContainer>
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
                                  <FadeIn>
                                    {showCompany ? (
                                      <Typography>{`${subItem.StockQuote?.Company} (${subItem.StockQuote?.Symbol})`}</Typography>
                                    ) : (
                                      <Typography>{dayjs(subItem.ReportDate).format('MM/DD/YYYY')}</Typography>
                                    )}
                                  </FadeIn>
                                </TableCell>
                                <TableCell>
                                  <FadeIn>
                                    <Typography color={getPositiveNegativeColor(subItem.ActualEarnings, theme.palette.mode)}>
                                      {`${subItem.ActualEarnings !== null ? numeral(subItem.ActualEarnings).format('0.00') : ''}`}
                                    </Typography>
                                  </FadeIn>
                                </TableCell>
                                <TableCell>
                                  <FadeIn>
                                    <Typography color={getPositiveNegativeColor(subItem.EstimatedEarnings, theme.palette.mode)}>
                                      {`${subItem.EstimatedEarnings ? numeral(subItem.EstimatedEarnings).format('0.00') : ''}`}
                                    </Typography>
                                  </FadeIn>
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
        )}
        {showChart && <AnnualEarningsReport apiData={annualData} mutateKey='x' />}
        {data.length === 0 && <NoDataFound />}
      </Box>
    </>
  )
}

export default StockEarningsTable

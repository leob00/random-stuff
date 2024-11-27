import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import dayjs from 'dayjs'
import { StockEarning, StockEarningAggregate } from 'lib/backend/api/qln/qlnApi'
import numeral from 'numeral'
import { useState } from 'react'
import { getPositiveNegativeColor } from '../StockListItem'
import { Box, Button, Typography } from '@mui/material'
import { uniq } from 'lodash'
import { useTheme } from '@mui/material'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { sortArray } from 'lib/util/collections'
import StockEarningsByYearBarChart from './StockEarningsByYearBarChart'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
dayjs.extend(quarterOfYear)

export interface StockEarningsGroup {
  key: number
  items: StockEarning[]
}

const StockEarningsTable = ({ data, showCompany = false }: { data: StockEarning[]; showCompany?: boolean }) => {
  const theme = useTheme()
  const yearsGroup: StockEarningsGroup[] = []
  const { myStocks, saveStockSettings } = useLocalStore()
  const earningSettingsStored = { ...myStocks }.earnings ?? {
    display: 'table',
  }
  const [earningSettings, setEarningSettings] = useState(earningSettingsStored)

  const years = uniq(data.filter((f) => f.ReportDate).map((m) => dayjs(m.ReportDate).year()))
  years.forEach((year) => {
    yearsGroup.push({
      key: year,
      items: data.filter((m) => dayjs(m.ReportDate).year() === year),
    })
  })
  const sortedYears = sortArray(yearsGroup, ['key'], ['asc'])

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
  const handleToggleChartTableView = () => {
    const newMyStocks = { ...myStocks }

    const newSettings = { ...newMyStocks, earings: { ...earningSettings, dispaly: earningSettings.display === 'chart' ? 'table' : 'chart' } }

    saveStockSettings(newSettings)
    setEarningSettings({ display: earningSettings.display === 'chart' ? 'table' : 'chart' })
  }
  return (
    <>
      <Box pl={1}>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <Button onClick={handleToggleChartTableView}>{earningSettings.display === 'chart' ? 'view table' : 'view chart'}</Button>
        </Box>
        {earningSettings.display === 'table' && (
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
        {earningSettings.display === 'chart' && <StockEarningsByYearBarChart data={data} />}
        {data.length === 0 && <NoDataFound />}
      </Box>
    </>
  )
}

export default StockEarningsTable

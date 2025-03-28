import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import { StockEarningsGroup } from './StockEarningsDisplay'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import dayjs from 'dayjs'
import { getPositiveNegativeColor } from '../StockListItem'
import numeral from 'numeral'

const StockEarningsTable = ({ data, showCompany }: { data: StockEarningsGroup[]; showCompany: boolean }) => {
  const theme = useTheme()
  return (
    <TableContainer>
      <Table>
        <TableBody>
          {data.map((item, index) => (
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
  )
}

export default StockEarningsTable

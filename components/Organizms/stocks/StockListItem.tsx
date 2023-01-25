import { TableBody, TableCell, TableRow } from '@aws-amplify/ui-react'
import { Box, ListItem, Paper, Stack, Table, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import ApexLineChart from 'components/Molecules/Charts/apex/ApexLineChart'
import { SimpleChartData, XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { CasinoBlack, CasinoBlackTransparent, CasinoGreen, DarkBlueTransparent } from 'components/themes/mainTheme'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { getStockChart } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

const StockListItem = ({ index, item }: { index: number; item: StockQuote }) => {
  const [quote, setQuote] = React.useState(item)
  const [showMore, setShowMore] = React.useState(false)
  const [chartData, setChartData] = React.useState<XyValues | null>(null)

  const getPositiveNegativeColor = (val: number) => {
    let color = CasinoBlack
    if (val < 0) {
      color = '#980036'
    } else if (val > 0) {
      color = CasinoGreen
    }
    return color
  }

  const renderDetail = (label: string, val?: string | number) => {
    return (
      <Stack direction={'row'} spacing={1} py={1}>
        <Stack>
          <Typography variant={'body2'}>{`${label}:`}</Typography>
        </Stack>
        <Stack>
          <Typography variant={'body2'} fontWeight={600} color={DarkBlueTransparent}>
            {val}
          </Typography>
        </Stack>
      </Stack>
    )
  }

  const handleCompanyClick = async (stockQuote: StockQuote) => {
    setShowMore(!showMore)

    if (!chartData && !showMore) {
      const history = await getStockChart(stockQuote.Symbol, 365)
      setQuote({ ...quote, History: history })
      const chart: XyValues = {
        x: history.map((o) => dayjs(o.TradeDate).format('MM/DD/YYYY')),
        y: history.map((o) => o.Price),
      }
      setChartData(chart)
      //console.log(chart)
      //console.log(JSON.stringify(chartData))
    }
  }

  return (
    <Box key={index} py={2}>
      <Paper sx={{ py: 1 }}>
        <Box>
          <Box sx={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px', backgroundColor: 'unset' }}>
            <Box>
              <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }}>
                <LinkButton
                  onClick={() => {
                    handleCompanyClick(quote)
                  }}
                >
                  <Typography textAlign={'left'} variant='h6'>
                    {`${quote.Symbol}: ${quote.Company}`}
                  </Typography>
                </LinkButton>
                {/*   <ListItemText primary={`${item.Symbol}: ${item.Company}`}></ListItemText>*/}
              </ListItem>
            </Box>
            <Stack direction={'row'} spacing={1} sx={{ backgroundColor: 'unset', minWidth: '25%' }} pt={1} pl={1} alignItems={'center'}>
              <Stack direction={'row'} spacing={2} pl={2} sx={{ backgroundColor: 'unset' }}>
                <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(quote.Change)}>{`${quote.Price.toFixed(2)}`}</Typography>
                <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(quote.Change)}>{`${quote.Change.toFixed(2)}`}</Typography>
                <Typography variant='h6' fontWeight={600} color={getPositiveNegativeColor(quote.Change)}>{`${quote.ChangePercent.toFixed(2)}%`}</Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
        {showMore && (
          <Box py={2} pl={3}>
            {renderDetail('Sector', quote.Sector)}
            {renderDetail('Cap', quote.MarketCapShort)}
            {renderDetail('P/E', quote.PeRatio)}
            <Box>{chartData && <ApexLineChart data={chartData} seriesName={''} yAxisDecorator='$' />}</Box>
            <Stack direction={'row'} spacing={1} py={1}>
              <Stack>
                <Typography fontSize={12} color={CasinoBlackTransparent}>
                  {dayjs(quote.TradeDate).format('MM/DD/YYYY hh:mm a')}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default StockListItem

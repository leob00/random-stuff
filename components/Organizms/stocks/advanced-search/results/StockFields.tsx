import { Box, Typography } from '@mui/material'
import { StockQuote } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'

interface Model {
  label: string
  val: string
}

export function mapStockField(field: keyof StockQuote, quote: StockQuote) {
  const item: Model = {
    label: '',
    val: '',
  }

  switch (field) {
    case 'Volume':
      item.label = 'volume'
      item.val = numeral(quote.Volume).format('###,###')
      break
    case 'MarketCapShort':
      item.label = 'cap'
      item.val = quote.MarketCapShort ?? ''
      break
    case 'MovingAvgDays':
      item.label = 'days'
      item.val = `${quote.MovingAvgDays}`
      break
    case 'PeRatio':
      item.label = 'p/e'
      item.val = `${quote.PeRatio}`
      break
    case 'AnnualDividendYield':
      item.label = 'yield'
      item.val = quote.AnnualDividendYield ? `${quote.AnnualDividendYield}%` : ''
  }
  return item
}

const StockFields = ({ quote, fields }: { quote: StockQuote; fields: Array<keyof StockQuote> }) => {
  const items = fields.map((m) => mapStockField(m, quote)).filter((f) => !!f.label)

  return (
    <Box pl={1}>
      <Box display={'flex'} gap={1}>
        <Box flexDirection={'column'}>
          {items.map((field) => (
            <Box key={field.label} flexDirection={'column'}>
              <Typography variant='body2' textAlign={'right'}>{`${field.label}:`}</Typography>
            </Box>
          ))}
        </Box>
        <Box flexDirection={'column'}>
          {items.map((field) => (
            <Box key={field.label} flexDirection={'column'}>
              <Typography variant='body2' textAlign={'left'} fontWeight={'bold'}>
                {field.val}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default StockFields

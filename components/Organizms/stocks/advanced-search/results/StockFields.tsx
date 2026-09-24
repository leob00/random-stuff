import { Box, Typography } from '@mui/material'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'

interface Model {
  label: string
  val: string
}

export function mapStockField(field: keyof StockQuote, quote: StockQuote) {
  const na = 'n/a'
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
      item.val = quote.MarketCapShort && quote.MarketCapShort !== '0' ? `${quote.MarketCapShort}` : ''
      break
    case 'MovingAvgDays':
      item.label = 'days'
      item.val = `${quote.MovingAvgDays}`
      break
    case 'PeRatio':
      item.label = 'p/e'
      item.val = `${quote.PeRatio ?? ''}`
      break
    case 'AnnualDividendYield':
      item.label = 'yield'
      item.val = quote.AnnualDividendYield ? `${quote.AnnualDividendYield}%` : ''
      break
    case 'TradeDate':
      item.label = 'date'
      item.val = dayjs(quote.TradeDate).format('MM/DD/YYYY hh:mm A')
      break
    case 'Sector':
      item.label = 'sector'
      item.val = quote.Sector ?? ''
      break
    case 'Industry':
      item.label = 'industry'
      item.val = quote.Industry ?? ''
      break
    case 'Class':
      item.label = 'category'
      item.val = quote.Class ?? ''
      break
  }
  return item
}

const StockFields = ({ quote, fields }: { quote: StockQuote; fields: Array<keyof StockQuote> }) => {
  const items = fields.map((m) => mapStockField(m, quote)).filter((f) => !!f.label)
  const nonLinked = items.filter((f) => f.label !== 'sector' && f.label !== 'industry')
  const linked = items.filter((f) => f.label === 'sector' || f.label === 'industry')

  return (
    <Box>
      <Box display={'flex'} gap={1}>
        <Box display={'flex'} flexDirection={'column'} gap={0.65}>
          {nonLinked.map((field) => (
            <Box key={field.label}>{field.val && <Typography variant='body2' textAlign={'right'}>{`${field.label}:`}</Typography>}</Box>
          ))}
        </Box>
        <Box display={'flex'} flexDirection={'column'} gap={0.68}>
          {nonLinked.map((field) => (
            <Box key={field.label}>
              {field.val && (
                <Box>
                  {field.label !== 'sector' && field.label !== 'industry' && (
                    <Typography variant='body2' textAlign={'left'} fontWeight={'bold'}>
                      {field.val}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
      <Box pt={1}>
        {linked.map((field) => (
          <Box key={field.label} display={'flex'} gap={1} alignItems={'center'}>
            {field.val && (
              <>
                {field.label === 'sector' && (
                  <>
                    <Typography variant='body2'>{`${field.label}:`}</Typography>
                    <SiteLink variant='body1' href={`/market/stocks/sectors/${encodeURIComponent(quote.SectorId!)}`} text={field.val} />
                  </>
                )}
                {field.label === 'industry' && (
                  <>
                    <Typography variant='body2'>{`${field.label}:`}</Typography>
                    <SiteLink variant='body1' href={`/market/stocks/industries/${encodeURIComponent(quote.IndustryId!)}`} text={field.val} />
                  </>
                )}
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default StockFields

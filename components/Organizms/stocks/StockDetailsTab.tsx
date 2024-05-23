import { Box, Chip, Typography } from '@mui/material'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import numeral from 'numeral'

const StockDetailsTab = ({ quote }: { quote: StockQuote }) => {
  return (
    <Box pb={2} pt={2}>
      {quote.Sector && <ReadOnlyField label={'Sector'} val={quote.Sector} />}
      {quote.Industry && <ReadOnlyField label={'Industry'} val={quote.Industry} />}
      <ReadOnlyField label={'Cap'} val={quote.MarketCapShort} />
      {quote.PeRatio && <ReadOnlyField label={'P/E'} val={quote.PeRatio} />}
      {quote.Volume && <ReadOnlyField label={'Volume'} val={numeral(quote.Volume).format('###,###')} />}
      <ReadOnlyField label={'Date'} val={dayjs(quote.TradeDate).format('MM/DD/YYYY hh:mm a')} />
      {quote.AnnualDividendYield && <ReadOnlyField label={'Annual Yield'} val={`${numeral(quote.AnnualDividendYield).format('0.000')}%`} />}
      {quote.Tags && (
        <>
          <Box display={'flex'} gap={2} alignItems={'center'} flexWrap={'wrap'}>
            <Typography variant={'body2'} color={'primary'}>{`tags:`}</Typography>
            {quote.Tags.map((tag) => (
              <Chip key={tag} variant='outlined' label={tag}></Chip>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}

export default StockDetailsTab

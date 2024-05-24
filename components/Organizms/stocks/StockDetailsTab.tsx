import { Box, Chip, Typography } from '@mui/material'
import Clickable from 'components/Atoms/Containers/Clickable'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useRouter } from 'next/router'
import numeral from 'numeral'

const StockDetailsTab = ({ quote }: { quote: StockQuote }) => {
  const router = useRouter()
  const handleTagClick = (tag: string) => {
    router.push(`/csr/stocks/stock-tags?id=${encodeURIComponent(tag)}`)
  }
  return (
    <Box pb={2} pt={2}>
      {quote.Sector && <ReadOnlyField label={'Sector'} val={quote.Sector} />}
      {quote.Industry && <ReadOnlyField label={'Industry'} val={quote.Industry} />}
      <ReadOnlyField label={'Cap'} val={quote.MarketCapShort} />
      {quote.PeRatio && <ReadOnlyField label={'P/E'} val={quote.PeRatio} />}
      {quote.Volume && <ReadOnlyField label={'Volume'} val={numeral(quote.Volume).format('###,###')} />}
      <ReadOnlyField label={'Date'} val={dayjs(quote.TradeDate).format('MM/DD/YYYY hh:mm a')} />
      {quote.AnnualDividendYield && <ReadOnlyField label={'Annual Yield'} val={`${numeral(quote.AnnualDividendYield).format('0.000')}%`} />}
      {quote.Tags && quote.Tags.length > 0 && (
        <>
          <Box display={'flex'} gap={2} alignItems={'center'} flexWrap={'wrap'}>
            <Typography variant={'body2'} color={'primary'}>{`tags:`}</Typography>
            {quote.Tags.map((tag) => (
              <Clickable
                key={tag}
                onClicked={() => {
                  handleTagClick(tag)
                }}
              >
                <Chip key={tag} variant='outlined' label={tag} />
              </Clickable>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}

export default StockDetailsTab

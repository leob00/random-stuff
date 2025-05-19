import { Box, Chip, Typography } from '@mui/material'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'
import Clickable from 'components/Atoms/Containers/Clickable'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import dayjs from 'dayjs'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useRouter } from 'next/router'
import numeral from 'numeral'
import StockSubscibeIcon from './StockSubscibeIcon'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'

const StockDetailsTab = ({ quote, authProfile }: { quote: StockQuote; authProfile: UserProfile | null }) => {
  const router = useRouter()
  const handleTagClick = (tag: string) => {
    router.push(`/csr/stocks/stock-tags?id=${encodeURIComponent(tag)}`)
  }
  const sector = quote.Sector
  return (
    <Box pb={2} pt={2}>
      <Box>
        <ReadOnlyField label={'Cap'} val={quote.MarketCapShort} />
        <ReadOnlyField label={'P/E'} val={quote.PeRatio ?? 'N/A'} />
        {quote.Volume && <ReadOnlyField label={'Volume'} val={numeral(quote.Volume).format('###,###')} />}
        <ReadOnlyField label={'Date'} val={dayjs(quote.TradeDate).format('MM/DD/YYYY hh:mm a')} />
        {quote.AnnualDividendYield && <ReadOnlyField label={'Annual Yield'} val={`${numeral(quote.AnnualDividendYield).format('0.000')}%`} />}
        {sector && (
          <Box display={'flex'} gap={1} alignItems={'center'} py={1}>
            <Typography variant='body2' color={'primary'}>
              Sector:
            </Typography>
            <SiteLink variant='body1' href={`/csr/stocks/sectors/${quote.SectorId}`} text={sector} />
          </Box>
        )}
        {/* {quote.Industry && <ReadOnlyField label={'Industry'} val={quote.Industry} />} */}
      </Box>

      {quote.Tags && quote.Tags.length > 0 && (
        <Box pt={2}>
          <Box display={'flex'} gap={2} flexWrap={'wrap'} flexDirection={{ xs: 'column', sm: 'row' }}>
            <Typography variant={'body2'} color={'primary'}>{`tags:`}</Typography>
            {quote.Tags.map((tag) => (
              <Clickable
                key={tag}
                onClicked={() => {
                  handleTagClick(tag)
                }}
              >
                <Chip variant='outlined' label={tag.length > 50 ? `${tag.substring(0, 35)}...` : tag} />
              </Clickable>
            ))}
          </Box>
        </Box>
      )}

      <Box pt={2}>
        <HorizontalDivider />
      </Box>
    </Box>
  )
}

export default StockDetailsTab

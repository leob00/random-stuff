import { Box, Chip, Typography } from '@mui/material'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'
import Clickable from 'components/Atoms/Containers/Clickable'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { useRouter } from 'next/router'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import StockFields from './advanced-search/results/StockFields'

const StockDetailsTab = ({ quote, authProfile }: { quote: StockQuote; authProfile: UserProfile | null }) => {
  const router = useRouter()
  const handleTagClick = (tag: string) => {
    router.push(`/csr/stocks/stock-tags?id=${encodeURIComponent(tag)}`)
  }
  const sector = quote.Sector
  return (
    <Box pb={2} pt={2}>
      <Box>
        <StockFields fields={['MarketCapShort', 'PeRatio', 'Volume', 'AnnualDividendYield', 'TradeDate', 'Sector']} quote={quote} />
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

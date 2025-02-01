import { Typography } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { StockEarning } from 'lib/backend/api/qln/qlnApi'

const StockEarningsCompanyDisplay = ({ item }: { item: StockEarning }) => {
  return (
    <FadeIn>
      <Typography px={2} variant='h6'>{`${item.StockQuote?.Company} (${item.StockQuote?.Symbol})`}</Typography>
    </FadeIn>
  )
}

export default StockEarningsCompanyDisplay

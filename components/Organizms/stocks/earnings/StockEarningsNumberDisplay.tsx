import FadeIn from 'components/Atoms/Animations/FadeIn'
import { getPositiveNegativeColor } from '../StockListItem'
import { Typography, useTheme } from '@mui/material'
import numeral from 'numeral'

const StockEarningsNumberDisplay = ({ num }: { num?: number | null }) => {
  const theme = useTheme()
  return (
    <FadeIn>
      <Typography color={getPositiveNegativeColor(num, theme.palette.mode)}>{`${num ? numeral(num).format('0.00') : ''}`}</Typography>
    </FadeIn>
  )
}

export default StockEarningsNumberDisplay

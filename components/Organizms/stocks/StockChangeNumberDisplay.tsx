import { Typography, useTheme } from '@mui/material'
import { getPositiveNegativeColor } from './StockListItem'
import numeral from 'numeral'

const StockChangeNumberDisplay = ({
  value,
  endSymbol = '',
  overwriteColor,
  changeDecimalPlaces = 2,
}: {
  value: number
  endSymbol?: string
  overwriteColor?: string
  changeDecimalPlaces?: number
}) => {
  const theme = useTheme()
  const color = overwriteColor ?? getPositiveNegativeColor(value, theme.palette.mode)
  let changeFormat = '0.00'
  if (changeDecimalPlaces) {
    changeFormat = '0.'
    let zeros = ''
    Array.from(new Array(changeDecimalPlaces)).forEach((_, index) => {
      zeros = `${zeros}0`
    })
    changeFormat = `${changeFormat}${zeros}`
  }
  return <Typography variant='h6' fontWeight={600} color={color}>{`${numeral(value).format(`###,###,${changeFormat}`)}${endSymbol}`}</Typography>
}

export default StockChangeNumberDisplay

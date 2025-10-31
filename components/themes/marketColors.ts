import { useTheme } from '@mui/material'
import { getPositiveNegativeColor } from 'components/Organizms/stocks/StockListItem'
import { CasinoGreen, CasinoRed, CasinoRedTransparent, CasinoRedTransparentChart, ErrorRed, RedDarkMode } from './mainTheme'

export const useMarketColors = () => {
  const theme = useTheme()
  const chartPositiveColor = CasinoGreen //getPositiveNegativeColor(1, theme.palette.mode)
  const chartNegativeColor = theme.palette.mode === 'dark' ? CasinoRedTransparentChart : CasinoRed //getPositiveNegativeColor(-1, theme.palette.mode)
  const chartUnchangedColor = getPositiveNegativeColor(0, theme.palette.mode)

  return {
    chart: {
      positiveColor: chartPositiveColor,
      negativeColor: chartNegativeColor,
      unchangedColor: chartUnchangedColor,
    },
  }
}

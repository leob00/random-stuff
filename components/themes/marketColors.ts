import { useTheme } from '@mui/material'
import { getPositiveNegativeColor } from 'components/Organizms/stocks/StockListItem'
import { CasinoGreen, CasinoRed, CasinoRedTransparent, CasinoRedTransparentChart, ErrorRed, RedDarkMode } from './mainTheme'

export const useMarketColors = () => {
  const theme = useTheme()
  const chartPositiveColor = CasinoGreen
  const chartNegativeColor = theme.palette.mode === 'dark' ? CasinoRedTransparentChart : CasinoRed
  const chartUnchangedColor = getPositiveNegativeColor(0, theme.palette.mode)

  const getPositiveNegativeChartColor = (val?: number) => {
    let result = chartUnchangedColor
    if (val) {
      if (val > 0) {
        result = chartPositiveColor
      }
      if (val < 0) {
        result = chartNegativeColor
      }
    }

    return result
  }

  return {
    getPositiveNegativeChartColor,
    chart: {
      positiveColor: chartPositiveColor,
      negativeColor: chartNegativeColor,
      unchangedColor: chartUnchangedColor,
    },
  }
}

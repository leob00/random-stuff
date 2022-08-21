import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import { CasinoBlackTransparent, CasinoGreen, CasinoRed } from 'components/themes/mainTheme'
import { filter, uniq, map, sortBy, cloneDeep } from 'lodash'
import { RouletteNumber, RouletteNumberColor } from '../roulette/wheel'

export function mapRouletteChart(numbers: RouletteNumber[]) {
  let ordered = cloneDeep(numbers)
  let reds = filter(ordered, function (e) {
    return e.color === 'red'
  })
  let blacks = filter(ordered, function (e) {
    return e.color === 'black'
  })
  let greens = filter(ordered, function (e) {
    return e.color === 'green'
  })
  let colors = [translateCasinoColor('red'), translateCasinoColor('black'), translateCasinoColor('green')]

  let result: BarChart = {
    labels: ['red', 'black', 'green'],
    numbers: [reds.length, blacks.length, greens.length],
    colors: colors,
  }
  return result
}

export function translateCasinoColor(color: RouletteNumberColor) {
  switch (color) {
    case 'red':
      return CasinoRed
    case 'black':
      return CasinoBlackTransparent
    case 'green':
      return CasinoGreen
    default:
      return color
  }
}

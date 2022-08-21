import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import { filter, uniq, map, sortBy } from 'lodash'
import { RouletteNumber } from '../roulette/wheel'

export function mapRouletteChart(numbers: RouletteNumber[]) {
  let ordered = sortBy(numbers, ['color'])
  let reds = filter(ordered, function (e) {
    return e.color === 'red'
  })
  let blacks = filter(ordered, function (e) {
    return e.color === 'black'
  })
  let greens = filter(ordered, function (e) {
    return e.color === 'green'
  })
  let colors: string[] = []

  let nums: number[] = []
  if (reds.length > 0) {
    nums.push(reds.length)
    colors.push('red')
  }
  if (blacks.length > 0) {
    nums.push(blacks.length)
    colors.push('black')
  }
  if (greens.length > 0) {
    nums.push(greens.length)
    colors.push('green')
  }

  let result: BarChart = {
    labels: colors,
    numbers: nums,
    colors: colors,
  }
  return result
}

import { Box, useTheme } from '@mui/material'
import { translateDetailValue } from '../stocks/EconCalendarDisplay'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { EconCalendarItem } from 'lib/backend/api/qln/qlnApi'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import SimpleBarChart from 'components/Atoms/Charts/chartJs/SimpleBarChart'
import { BarChart, getBarChartOptions, getMultiDatasetBarChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { CasinoBlue } from 'components/themes/mainTheme'
import { getPositiveNegativeColor } from '../stocks/StockListItem'

const EconCalendarDetail = ({ selectedItem }: { selectedItem: EconCalendarItem }) => {
  const theme = useTheme()
  let colors = [CasinoBlue, CasinoBlue]
  const chartOptions = { ...getBarChartOptions('', '', theme.palette.mode) }
  //   chartOptions.plugins!.tooltip!.callbacks = {
  //       afterLabel: (tooltipItems) => {
  //         const result = `${tooltipItems.dataset.label}: `
  //          return `${result}${translateDetailValue}`
  //       }
  //   }
  if (!!selectedItem.Actual && !!selectedItem.Previous) {
    const gain = selectedItem.Actual - selectedItem.Previous
    const loss = selectedItem.Previous - selectedItem.Actual
    if (gain < loss) {
      colors[0] = getPositiveNegativeColor(gain, theme.palette.mode)
    } else {
      colors[1] = getPositiveNegativeColor(loss, theme.palette.mode)
    }
  }

  const barChart: BarChart = {
    colors: colors,
    labels: ['actual', 'previous'],
    numbers: [selectedItem.Actual ?? 0, selectedItem.Previous ?? 0],
  }
  return (
    <>
      <Box pl={2} display={'flex'} gap={4} alignItems={'center'}>
        {!!selectedItem.Actual && <ReadOnlyField label='actual' val={translateDetailValue(selectedItem.Actual, selectedItem.ActualUnits)} />}
        {!!selectedItem.Consensus && <ReadOnlyField label='consensus' val={translateDetailValue(selectedItem.Consensus, selectedItem.ConsensusUnits)} />}
        {!!selectedItem.Previous && <ReadOnlyField label='previous' val={translateDetailValue(selectedItem.Previous, selectedItem.PreviousUnits)} />}
      </Box>
      {!!selectedItem.Actual && <SimpleBarChart barChart={barChart} chartOptions={chartOptions} />}
      <Box>
        <HtmlView html={selectedItem.TypeDescription.replaceAll('&amp;lt;BR/&amp;gt;&amp;lt;BR/&amp;gt;', ' ')} textAlign='left' />
      </Box>
    </>
  )
}

export default EconCalendarDetail

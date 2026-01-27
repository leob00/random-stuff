import { Box, Stack, useTheme } from '@mui/material'
import { translateDetailValue } from '../stocks/EconCalendarDisplay'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { EconCalendarItem } from 'lib/backend/api/qln/qlnApi'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import SimpleBarChart from 'components/Atoms/Charts/chartJs/SimpleBarChart'
import { BarChart, getBarChartOptions } from 'components/Atoms/Charts/chartJs/barChartOptions'
import { CasinoBlue, CasinoOrangeTransparentOpaque, VeryLightBlueTransparent } from 'components/themes/mainTheme'
import numeral from 'numeral'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import JsonView from 'components/Atoms/Boxes/JsonView'
import EconCalendarDetailHistory from './EconCalendarDetailHistory'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

type Model = EconCalendarItem & {
  changeFromPrevious?: number
}
const EconCalendarDetail = ({ selectedItem, history, isLoading }: { selectedItem: EconCalendarItem; history: EconCalendarItem[]; isLoading?: boolean }) => {
  const theme = useTheme()
  let chartColors = [CasinoBlue, VeryLightBlueTransparent]
  let chartLabels = ['actual', 'previous']
  let chartNumbers = [selectedItem.Actual ?? 0, selectedItem.Previous ?? 0]
  const chartOptions = { ...getBarChartOptions('', '', theme.palette.mode) }

  const item: Model = { ...selectedItem }
  if (!!selectedItem.Actual && !!selectedItem.Previous) {
    item.changeFromPrevious = Number(numeral(selectedItem.Actual - selectedItem.Previous).format('0,0.0000'))
  }

  if (!!item.Consensus) {
    chartColors.push(CasinoOrangeTransparentOpaque)
    chartLabels.push('consensus')
    chartNumbers.push(selectedItem.Consensus!)
  }
  const barChart: BarChart = {
    colors: chartColors,
    labels: chartLabels,
    numbers: chartNumbers,
  }

  chartOptions.plugins!.tooltip!.callbacks = {
    label: (tooltipItem) => {
      if (tooltipItem.dataIndex === 0) {
        return `${translateDetailValue(item.Actual, item.ActualUnits)}`
      }
      if (tooltipItem.dataIndex === 1) {
        return `${translateDetailValue(item.Previous, item.PreviousUnits)}`
      }
      if (tooltipItem.dataIndex === 2) {
        return `${translateDetailValue(item.Consensus, item.ConsensusUnits)}`
      }
      return `${tooltipItem.formattedValue}`
    },
  }

  const noData = !selectedItem.Actual && !selectedItem.TypeDescription && !selectedItem.Consensus

  return (
    <Stack>
      <Box pl={2} display={'flex'} gap={4} alignItems={'center'}>
        {!!item.Actual && <ReadOnlyField label='actual' val={translateDetailValue(item.Actual, item.ActualUnits)} />}
        {!!item.changeFromPrevious && (
          <ReadOnlyField label='change' val={translateDetailValue(item.changeFromPrevious, item.ActualUnits ?? item.PreviousUnits)} />
        )}
        {!!item.Consensus && <ReadOnlyField label='consensus' val={translateDetailValue(item.Consensus, item.ConsensusUnits)} />}
        {!!item.Previous && <ReadOnlyField label='previous' val={translateDetailValue(item.Previous, item.PreviousUnits)} />}
      </Box>
      {!!item.Actual && (
        <Box px={{ xs: 0, sm: 4, md: 8, lg: 12 }}>
          <SimpleBarChart barChart={barChart} chartOptions={chartOptions} />
        </Box>
      )}
      <Box>
        <HtmlView html={item.TypeDescription.replaceAll('&amp;lt;BR/&amp;gt;&amp;lt;BR/&amp;gt;', ' ')} textAlign='left' />
      </Box>

      {noData && <NoDataFound message='no additional information is currently available' />}
      {history && (
        <Box>
          <EconCalendarDetailHistory data={history} />
        </Box>
      )}
    </Stack>
  )
}

export default EconCalendarDetail

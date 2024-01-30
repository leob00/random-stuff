import React from 'react'
import { Alert, Box, IconButton, Typography } from '@mui/material'
import { EconomicDataItem, QlnLineChart } from 'lib/backend/api/qln/qlnModels'
import EconDataChart from 'components/Organizms/econ/EconDataChart'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import dayjs from 'dayjs'
import numeral from 'numeral'
import CloseIcon from '@mui/icons-material/Close'
import { DropdownItem } from 'lib/models/dropdown'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import { range } from 'lodash'
import { apiConnection } from 'lib/backend/api/config'
import { post } from 'lib/backend/api/fetchFunctions'
import { EconDataModel } from '../stocks/EconDataLayout'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'

interface Model {
  startYearOptions: DropdownItem[]
  endYearOptions: DropdownItem[]
  chart: QlnLineChart
  selectedStartYear: number
  selectedEndYear: number
  error: string | null
  isLoading: boolean
}
const config = apiConnection().qln

const EconDataDetails = ({ item, onClose }: { item: EconomicDataItem; onClose: () => void }) => {
  const itemChart = item.Chart ?? { RawData: [], XValues: [], YValues: [] }
  const startYear = dayjs(item.FirstObservationDate!).year()
  const endYear = dayjs(item.LastObservationDate!).year()
  const allYears = range(startYear, endYear + 1)

  const startYearOptions: DropdownItem[] = allYears.map((m) => {
    return {
      text: String(m),
      value: String(m),
    }
  })
  const endYearOptions = [...startYearOptions]
  const defaultModel: Model = {
    startYearOptions: startYearOptions,
    endYearOptions: endYearOptions,
    chart: itemChart,
    selectedStartYear: item.criteria!.startYear,
    selectedEndYear: item.criteria!.endYear,
    error: null,
    isLoading: false,
  }
  const [model, setModel] = React.useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const loadDetails = async (id: string, yearStart: number, yearEnd: number) => {
    if (yearStart > yearEnd) {
      setModel({ ...model, error: 'start year should be before end year', selectedStartYear: yearStart, selectedEndYear: yearEnd })
      return
    }
    if (Math.abs(yearEnd - yearStart) > 10) {
      setModel({ ...model, error: 'range hould be between 10 years or less ', selectedStartYear: yearStart, selectedEndYear: yearEnd })
      return
    }
    setModel({ ...model, isLoading: true })
    const url = `${config.url}/EconReports`
    const resp = (await post(url, {
      Id: id,
      StartYear: yearStart,
      EndYear: yearEnd,
    })) as EconDataModel
    const result = resp.Body.Item
    setModel({ ...model, error: null, chart: result.Chart!, isLoading: false })
  }

  const handleStartYearChange = async (val: string) => {
    await loadDetails(item.InternalId, Number(val), model.selectedEndYear)
  }
  const handleEndYearChange = async (val: string) => {
    await loadDetails(item.InternalId, model.selectedStartYear, Number(val))
  }
  return (
    <Box p={1}>
      {model.isLoading && <BackdropLoader />}

      <Box py={2} display='flex' justifyContent={'space-between'} alignItems={'center'}>
        <Box>
          <Typography variant='h6'>{item.Title}</Typography>
        </Box>
        <Box justifyContent={'flex-end'}>
          <IconButton size='small' onClick={onClose} color='primary'>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>
      <EconDataChart chart={model.chart} />
      <Box py={2}>
        <ReadOnlyField label={'value'} val={numeral(model.chart.YValues[model.chart.YValues.length - 1]).format('###,###.0,00')} />

        <ReadOnlyField
          label='date range'
          val={`${dayjs(model.chart.XValues[0]).format('MM/DD/YYYY')} - ${dayjs(model.chart.XValues[model.chart.XValues.length - 1]).format('MM/DD/YYYY')}`}
        />
      </Box>
      <Box display={'flex'} gap={1} alignItems={'center'}>
        <Typography>years from:</Typography>
        <DropdownList options={model.startYearOptions} selectedOption={String(model.selectedStartYear)} onOptionSelected={handleStartYearChange} />
        <Typography>to:</Typography>
        <DropdownList options={model.endYearOptions} selectedOption={String(model.selectedEndYear)} onOptionSelected={handleEndYearChange} />
      </Box>
      {model.error && (
        <Box py={2}>
          <Alert severity='error'>{model.error}</Alert>
        </Box>
      )}
      <Box py={2}>
        <ReadOnlyField
          val={`data available from ${dayjs(item.FirstObservationDate).format('MM/DD/YYYY')} to ${dayjs(item.LastObservationDate).format('MM/DD/YYYY')}`}
        />
      </Box>

      <Box py={2}>
        <Typography>{item.Notes}</Typography>
      </Box>
    </Box>
  )
}

export default EconDataDetails

'use client'
import { Alert, Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import dayjs from 'dayjs'
import { DropdownItem } from 'lib/models/dropdown'
import { range } from 'lodash'
import UncontrolledDropdownList from 'components/Atoms/Inputs/UncontrolledDropdownList'
import { useReducer } from 'react'
import EconChart, { mapEconChartToStockHistory } from '../widgets/econ/EconChart'
import { WidgetDimensions } from '../widgets/RenderWidget'
import { reverseColor } from '../widgets/econ/EconWidget'
import { getEconDataReport, getEconDataReportByDateRange } from 'lib/backend/api/qln/qlnApi'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import EconChangeHeader from '../widgets/econ/EconChangeHeader'
import { useViewPortSize } from 'hooks/ui/useViewportSize'
import FormDatePicker from 'components/Molecules/Forms/ReactHookForm/FormDatePicker'

interface Model {
  startYearOptions: DropdownItem[]
  endYearOptions: DropdownItem[]
  selectedStartYear: number
  selectedEndYear: number
  error: string | null
  isLoading: boolean
  item: EconomicDataItem
  selectedStartDate?: string | null
  selectedEndDate?: string | null
}

const EconDataDetails = ({ item, showLast = true, showYearSelect = true }: { item: EconomicDataItem; showLast?: boolean; showYearSelect?: boolean }) => {
  const { viewPortSize } = useViewPortSize()
  const theme = useTheme()
  const isXSmallDevice = useMediaQuery(theme.breakpoints.down('sm'))
  const isLargeDevice = useMediaQuery(theme.breakpoints.up('md'))

  const dimension: WidgetDimensions = {
    height: 400,
    width: isXSmallDevice ? 370 : 280,
  }
  if (!isXSmallDevice) {
    if (isLargeDevice) {
      dimension.height = 560
      dimension.width = 1100
    } else {
      dimension.width = 680
    }
  }

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
    selectedStartYear: item.criteria!.startYear < startYear ? startYear : item.criteria?.startYear!,
    selectedEndYear: item.criteria!.endYear,
    error: null,
    isLoading: false,
    item: item,
    selectedStartDate: item.criteria!.startDt,
    selectedEndDate: item.criteria!.endDt,
  }
  const [model, setModel] = useReducer((state: Model, newState: Model) => ({ ...state, ...newState }), defaultModel)

  const loadDetails = async (id: number, yearStart: number, yearEnd: number) => {
    if (yearStart > yearEnd) {
      setModel({ ...model, error: 'start year should be before end year', selectedStartYear: yearStart, selectedEndYear: yearEnd })
      return
    }
    if (Math.abs(yearEnd - yearStart) > 15) {
      setModel({ ...model, error: 'range should be between 15 years or less ', selectedStartYear: yearStart, selectedEndYear: yearEnd })
      return
    }
    setModel({ ...model, isLoading: true })
    const resp = await getEconDataReport(id, yearStart, yearEnd)
    const selectedStartDate = dayjs(resp.Chart!.XValues[0]).format()
    const selectedEndDate = dayjs(resp.Chart!.XValues[resp.Chart!.XValues.length - 1]).format()
    setModel({
      ...model,
      error: null,
      item: resp,
      isLoading: false,
      selectedStartYear: yearStart,
      selectedEndYear: yearEnd,
      selectedStartDate: selectedStartDate,
      selectedEndDate: selectedEndDate,
    })
  }

  const loadDetailsByDateRange = async (id: number, startDate: string, endDate: string) => {
    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      setModel({ ...model, error: 'start year should be before end year' })
      return
    }
    if (Math.abs(dayjs(endDate).year() - dayjs(startDate).year()) > 15) {
      setModel({ ...model, error: 'range should be between 15 years or less' })
      return
    }
    setModel({ ...model, isLoading: true })
    const resp = await getEconDataReportByDateRange(id, startDate, endDate)
    const selectedStartDate = dayjs(resp.Chart!.XValues[0]).format()
    const selectedEndDate = dayjs(resp.Chart!.XValues[resp.Chart!.XValues.length - 1]).format()
    setModel({
      ...model,
      error: null,
      item: resp,
      isLoading: false,
      selectedStartDate: selectedStartDate,
      selectedEndDate: selectedEndDate,
    })
  }

  const handleStartYearChange = async (val: string) => {
    await loadDetails(item.InternalId, Number(val), model.selectedEndYear)
  }
  const handleEndYearChange = async (val: string) => {
    await loadDetails(item.InternalId, model.selectedStartYear, Number(val))
  }

  const handleReset = () => {
    setModel(defaultModel)
  }

  const hadleFilter = (starDt: string, endDt: string) => {}

  const handleFilterDateStartChange = (startDt: string) => {
    loadDetailsByDateRange(item.InternalId, startDt, model.selectedEndDate!)
    //setModel({ ...model, selectedStartDate: startDt ?? undefined })
  }
  const handleFilterDateEndChange = (endDt: string) => {
    loadDetailsByDateRange(item.InternalId, model.selectedEndDate!, endDt)
  }

  const shouldReverseColor = reverseColor(item.InternalId)

  const xValues = model.item.Chart?.XValues ?? []
  const yValues = model.item.Chart?.YValues.map((m) => Number(m)) ?? []
  const history = mapEconChartToStockHistory(item.Title, xValues, yValues, isXSmallDevice, viewPortSize)
  const last = history[history.length - 1]
  return (
    <Box py={2}>
      {showLast && (
        <Box display={'flex'} pb={4} justifyContent={'center'}>
          <EconChangeHeader last={last} reverseColor={shouldReverseColor} showLabel />
        </Box>
      )}
      {showYearSelect && (
        <Box display={'flex'} justifyContent={'center'}>
          <Box display={'flex'} gap={1} alignItems={'center'}>
            <Typography>from:</Typography>
            <UncontrolledDropdownList
              options={model.startYearOptions}
              selectedOption={String(model.selectedStartYear)}
              onOptionSelected={handleStartYearChange}
            />
            <Typography>to:</Typography>
            <UncontrolledDropdownList options={model.endYearOptions} selectedOption={String(model.selectedEndYear)} onOptionSelected={handleEndYearChange} />
            <Button onClick={handleReset} size='small'>
              <Typography>reset</Typography>
            </Button>
          </Box>
        </Box>
      )}
      {model.error && (
        <Box py={2}>
          <Alert severity='error'>{model.error}</Alert>
        </Box>
      )}
      {model.isLoading && <ComponentLoader />}
      <Box display={'flex'} gap={2} alignItems={'center'}>
        {model.selectedStartDate && (
          <FormDatePicker
            onDateSelected={handleFilterDateStartChange}
            minDate={model.item.FirstObservationDate}
            value={model.selectedStartDate}
            maxDate={model.item.LastObservationDate}
          />
        )}
        {model.selectedEndDate && (
          <FormDatePicker
            onDateSelected={handleFilterDateEndChange}
            minDate={model.item.FirstObservationDate}
            maxDate={model.item.LastObservationDate}
            value={model.selectedEndDate}
          />
        )}
      </Box>

      <EconChart symbol={item.Title} data={model.item} reverseColor={shouldReverseColor} />
      <Box py={2} textAlign={'center'}>
        <Typography variant='caption'>{`data available from ${dayjs(item.FirstObservationDate).format('MM/DD/YYYY')} to ${dayjs(item.LastObservationDate).format('MM/DD/YYYY')} on a ${item.Frequency} basis.`}</Typography>
      </Box>
      <Box py={2}>
        <Typography sx={{ wordWrap: 'break-word' }}>{item.Notes}</Typography>
      </Box>
    </Box>
  )
}

export default EconDataDetails

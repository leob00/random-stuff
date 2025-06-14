import { Alert, Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import dayjs from 'dayjs'
import { DropdownItem } from 'lib/models/dropdown'
import { range } from 'lodash'
import { apiConnection } from 'lib/backend/api/config'
import { post } from 'lib/backend/api/fetchFunctions'
import { EconDataModel } from './EconDataLayout'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import UncontrolledDropdownList from 'components/Atoms/Inputs/UncontrolledDropdownList'
import { useReducer } from 'react'
import EconChart from '../widgets/econ/EconChart'
import { WidgetDimensions } from '../widgets/RenderWidget'
import { reverseColor } from '../widgets/econ/EconWidget'

interface Model {
  startYearOptions: DropdownItem[]
  endYearOptions: DropdownItem[]
  // chart: QlnLineChart
  selectedStartYear: number
  selectedEndYear: number
  error: string | null
  isLoading: boolean
  item: EconomicDataItem
}
const config = apiConnection().qln

const EconDataDetails = ({ item, onClose }: { item: EconomicDataItem; onClose: () => void }) => {
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
    const url = `${config.url}/EconReports`
    const resp = (await post(url, {
      Id: id,
      StartYear: yearStart,
      EndYear: yearEnd,
    })) as EconDataModel
    const result = resp.Body.Item
    setModel({ ...model, error: null, item: result, isLoading: false, selectedStartYear: yearStart, selectedEndYear: yearEnd })
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
  const shouldReverseColor = reverseColor(item.InternalId)

  return (
    <Box py={2}>
      {model.isLoading && <BackdropLoader />}
      <Box display={'flex'} justifyContent={'center'} py={2}>
        <Box py={2} minHeight={dimension.height} px={1}>
          <EconChart
            symbol={item.Title}
            data={model.item}
            width={dimension.width}
            height={dimension.height}
            reverseColor={shouldReverseColor}
            isExtraSmall={isXSmallDevice}
          />
        </Box>
      </Box>
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
      {model.error && (
        <Box py={2}>
          <Alert severity='error'>{model.error}</Alert>
        </Box>
      )}
      <Box py={2} textAlign={'center'}>
        <Typography variant='caption'>{`data available from ${dayjs(item.FirstObservationDate).format('MM/DD/YYYY')} to ${dayjs(item.LastObservationDate).format('MM/DD/YYYY')}`}</Typography>
      </Box>
      <Box py={2}>
        <Typography sx={{ wordWrap: 'break-word' }}>{item.Notes}</Typography>
      </Box>
    </Box>
  )
}

export default EconDataDetails

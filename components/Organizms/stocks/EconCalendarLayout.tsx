import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { DateRange, EconCalendarItem, serverPostFetch } from 'lib/backend/api/qln/qlnApi'
import EconCalendarDisplay from './EconCalendarDisplay'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { useState } from 'react'
import { mutate } from 'swr'
import { sortArray } from 'lib/util/collections'
import dayjs from 'dayjs'

import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

export interface EconCalendarBody {
  Items: EconCalendarItem[]
  AvailableDates: DateRange
  AvailableCountries?: string[]
}

const EconCalendarLayout = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs(dayjs().format('MM/DD/YYYY')).format())
  const [availableDates, setAvailableDates] = useState<DateRange | null>(null)
  const [availableCountries, setAvailableCountries] = useState<string[] | null>(null)
  const mutateKey = `econ-calendar-${selectedDate}`
  var dataFn = async () => {
    const endPoint = '/EconCalendarSearch'
    const filter = {
      StartDate: dayjs(selectedDate).format(),
      EndDate: dayjs(selectedDate).add(1, 'days').format(),
      LoadLookupValues: !availableCountries,
    }
    const resp = await serverPostFetch({ body: filter }, endPoint)
    const result = resp.Body as EconCalendarBody
    if (!availableDates) {
      setAvailableDates(result.AvailableDates)
    }
    if (!availableCountries) {
      setAvailableCountries(result.AvailableCountries ?? [])
    }
    return { ...result, Items: sortArray(result.Items, ['EventDate'], ['asc']) }
  }
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  const handleDateSelected = (dt: string) => {
    setSelectedDate(dayjs(dt).format())
    mutate(mutateKey)
  }

  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      {availableDates && availableCountries && (
        <EconCalendarDisplay
          apiResult={data}
          selectedDate={selectedDate}
          onChangeDate={handleDateSelected}
          availableDates={availableDates}
          availableCountries={availableCountries ?? []}
        />
      )}
    </Box>
  )
}

export default EconCalendarLayout

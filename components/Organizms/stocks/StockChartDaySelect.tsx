'use client'
import { Box } from '@mui/material'
import FormDropdownListNumeric from 'components/Molecules/Forms/ReactHookForm/FormDropdownListNumeric'
import dayjs from 'dayjs'
import { DateRange } from 'lib/backend/api/qln/qlnApi'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import { DropdownItemNumeric } from 'lib/models/dropdown'
import { max, subtract } from 'lodash'

const StockChartDaySelect = ({
  selectedDays,
  onSelected,
  availableDates,
  showIntraday = false,
}: {
  selectedDays: number
  onSelected: (arg: number) => void
  availableDates?: DateRange
  showIntraday?: boolean
}) => {
  const { stocksChart: stockChartSettings, saveStockChart } = useSessionStore()
  let daysToSelect = selectedDays

  const hasDateRange = !!availableDates
  let options: DropdownItemNumeric[] = getstockChartDays(showIntraday)
  if (hasDateRange) {
    const dayDiff = dayjs(dayjs(availableDates.EndDate).format()).diff(dayjs(dayjs(availableDates.StartDate).subtract(1, 'days').format()), 'days')
    if (dayDiff > 0) {
      // very little history available
      if (dayDiff < 7) {
        options = options.filter((m) => m.value > 0 && m.value < 7)
        options.push({
          text: `${dayDiff} days`,
          value: dayDiff,
        })
      } else {
        options = options.filter((m) => m.value <= dayDiff)
      }
    }
  }
  let found = options.find((m) => m.value == daysToSelect)
  const maxOptionVal = max(options.map((m) => m.value)) ?? 0
  if (daysToSelect > maxOptionVal) {
    daysToSelect = options.find((m) => m.value === maxOptionVal)?.value!
  } else {
    found = options.find((m) => m.value == daysToSelect)
    if (!found) {
      if (daysToSelect > 1 && daysToSelect < 7) {
        daysToSelect = maxOptionVal
      } else {
        daysToSelect = -1
      }
    }
  }

  const handleDaysSelected = (arg: number | null) => {
    if (arg !== null) {
      if (found) {
        let newDays = arg
        if (arg === -1) {
          newDays = getYearToDateDays()
        }

        saveStockChart({ ...stockChartSettings, defaultDays: arg === -1 ? arg : newDays })
      } else {
        saveStockChart({ ...stockChartSettings, defaultDays: arg })
      }
      onSelected(arg)
    }
  }
  // let options: DropdownItemNumeric[] = availableDates
  //   ? getstockChartDays(showIntraday).filter((m) => m.value <= 0 || m.value <= dayjs(availableDates.EndDate).diff(dayjs(availableDates.StartDate), 'days'))
  //   : getstockChartDays(showIntraday)

  // if (availableDates) {
  //   let daysDiff = dayjs(dayjs(availableDates.EndDate).format('YYYY-MM-DD')).diff(dayjs(dayjs(availableDates.StartDate).format('YYYY-MM-DD')), 'days')
  //   if (daysDiff > 0 && daysDiff < 7) {
  //     options.push({ text: `${daysDiff} days`, value: daysDiff })
  //   } else {
  //     const startDate = dayjs(availableDates.StartDate)
  //     if (startDate.isAfter(dayjs(new Date(dayjs().year(), 0, 3)))) {
  //       options = options.filter((m) => m.value > -1)
  //     }
  //   }

  //   if (options.length === 0) {
  //     const d = daysDiff > 0 ? daysDiff : 1
  //     const text = daysDiff > 0 ? 'days' : 'day'
  //     options.push({ text: `${d} ${text}`, value: daysDiff > 0 ? daysDiff : 1 })
  //     daysDiff = 1
  //   }
  // }

  // if (availableDates) {
  //   const optionDays = options.map((m) => m.value)
  //   const maxDays = max(optionDays)!
  //   const daysDiff = dayjs(dayjs(availableDates.EndDate).format('YYYY-MM-DD')).diff(dayjs(dayjs(availableDates.StartDate).format('YYYY-MM-DD')), 'days')
  //   if (selectedDays > 0 && selectedDays > maxDays) {
  //     if (showIntraday) {
  //       if (selectedDays > daysDiff) {
  //         daysToSelect = options.findLast((m) => m.value <= daysDiff)?.value!
  //       } else {
  //         daysToSelect = options[options.length - 1].value
  //       }
  //     }
  //   }

  //   if (!optionDays.includes(daysToSelect)) {
  //     if (!showIntraday) {
  //       daysToSelect = 90
  //     } else {
  //       daysToSelect = options[options.length - 1].value
  //     }
  //  }
  // }

  return (
    <Box textAlign={'right'} pr={1} py={1}>
      {daysToSelect > -2 && <FormDropdownListNumeric options={options} value={daysToSelect} onOptionSelected={handleDaysSelected} minWidth={140} />}
    </Box>
  )
}

export function getstockChartDays(showIntraday: boolean = false, showYtd = true) {
  let result: DropdownItemNumeric[] = []
  let shortTerm: DropdownItemNumeric[] = [
    { text: '1 day', value: 1 },
    { text: '1 week', value: 7 },
    { text: '1 month', value: 30 },
    { text: '3 months', value: 90 },
    { text: '6 months', value: 180 },
  ]
  const longTerm: DropdownItemNumeric[] = [
    { text: '1 year', value: 365 },
    { text: '3 year', value: 1095 },
    { text: '5 year', value: 1825 },
  ]
  if (showYtd) {
    shortTerm.push({
      text: 'YTD',
      value: -1,
    })
  }
  if (!showIntraday) {
    shortTerm = shortTerm.filter((m) => m.value !== 1)
  }
  result = [...shortTerm, ...longTerm]
  return result
}

export function getYearToDateDays() {
  let now = dayjs()
  const jan1 = new Date(now.year(), 0, 1)
  const jan1StartDt = dayjs(jan1)
  const ytdDays = now.diff(jan1StartDt, 'day')
  return ytdDays
}

export default StockChartDaySelect

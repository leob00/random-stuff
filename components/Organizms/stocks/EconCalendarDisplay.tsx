import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { EconCalendarBody } from './EconCalendarLayout'
import ArrowLeftButton from 'components/Atoms/Buttons/ArrowLeftButton'
import ArrowRightButton from 'components/Atoms/Buttons/ArrowRightButton'
import { DateRange, EconCalendarItem } from 'lib/backend/api/qln/qlnApi'
import FilterListAltIcon from '@mui/icons-material/FilterListAlt'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import { Fragment, useState } from 'react'
import { DropdownItem } from 'lib/models/dropdown'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import { sortArray } from 'lib/util/collections'
import numeral from 'numeral'
import EconCalendarDetail from '../econCalendar/EconCalendarDetail'

export type EconCalendarFilter = {
  startDate?: string
  endDate?: string
  country?: string
}

const EconCalendarDisplay = ({
  apiResult,
  selectedDate,
  onChangeDate,
  availableDates,
  availableCountries,
}: {
  apiResult?: EconCalendarBody
  selectedDate: string
  onChangeDate: (dt: string) => void
  availableDates: DateRange
  availableCountries: string[]
}) => {
  const { econCalendarSettings, setEconCalendarSettings } = useLocalStore()

  const countryOptions: DropdownItem[] = availableCountries.map((m) => {
    return {
      text: m,
      value: m,
    }
  })

  const countryDropdown = [{ text: 'All', value: 'all' }, ...sortArray(countryOptions, ['text'], ['asc'])]
  const filteredItems = filterItems(apiResult?.Items ?? [], econCalendarSettings?.filter)
  const [selectedItem, setSelectedItem] = useState<EconCalendarItem | null>(null)

  const handleBackClick = () => {
    onChangeDate(dayjs(selectedDate).subtract(1, 'days').format())
  }
  const handleNextClick = () => {
    onChangeDate(dayjs(selectedDate).add(1, 'days').format())
  }
  const handleShowDetails = (item: EconCalendarItem) => {
    if (!!selectedItem && selectedItem.RecordId === item.RecordId) {
      setSelectedItem(null)
      return
    }
    setSelectedItem(item)
  }

  const handleFilterByCountry = (item: DropdownItem) => {
    setEconCalendarSettings({ ...econCalendarSettings, filter: { country: item.value ?? undefined } })
  }
  const handleShowHideFilter = (show: boolean) => {
    if (!show) {
      setEconCalendarSettings({ ...econCalendarSettings, filter: undefined })
    } else {
      setEconCalendarSettings({ ...econCalendarSettings, filter: { country: countryDropdown[0].value } })
    }
  }

  return (
    <Box pt={2}>
      <Box display={'flex'} justifyContent={'center'} gap={1} alignItems={'center'} pb={2}>
        <ArrowLeftButton
          disabled={dayjs(selectedDate).format('MM/DD/YYYY') === dayjs(availableDates.StartDate).format('MM/DD/YYYY')}
          onClicked={handleBackClick}
        />
        <Box display={'flex'} flexDirection={'column'} textAlign={'center'}>
          <Box>
            <Typography variant='caption'>{dayjs(selectedDate).format('dddd')}</Typography>
          </Box>
          <Box>
            <Typography>{dayjs(selectedDate).format('MM/DD/YYYY')}</Typography>
          </Box>
        </Box>
        <ArrowRightButton
          disabled={dayjs(selectedDate).format('MM/DD/YYYY') === dayjs(availableDates.EndDate).format('MM/DD/YYYY')}
          onClicked={handleNextClick}
        />
      </Box>
      <HorizontalDivider />
      <Box>
        <Box display='flex' justifyContent={'space-between'} py={2}>
          <Box>
            {!!econCalendarSettings?.filter && (
              <StaticAutoComplete
                disableClearable
                options={countryDropdown}
                selectedItem={countryDropdown.find((m) => m.value === econCalendarSettings?.filter?.country)}
                onSelected={handleFilterByCountry}
              />
            )}
          </Box>
          <Box>
            {!econCalendarSettings?.filter ? (
              <IconButton
                color='primary'
                size='small'
                onClick={() => {
                  handleShowHideFilter(true)
                }}
              >
                <FilterListAltIcon fontSize='small' />
              </IconButton>
            ) : (
              <IconButton
                color='primary'
                size='small'
                onClick={() => {
                  handleShowHideFilter(false)
                }}
              >
                <FilterListOffIcon fontSize='small' />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      <ScrollableBox maxHeight={640}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Country</TableCell>
            </TableRow>
          </TableHead>
          {apiResult && (
            <TableBody>
              {filteredItems.map((item) => (
                <Fragment key={item.RecordId}>
                  <TableRow>
                    <TableCell valign='top' sx={{ borderBottom: !!selectedItem && selectedItem.RecordId === item.RecordId ? 'none' : 'unset' }}>
                      <Box>
                        <ListHeader
                          text={item.TypeName}
                          onClicked={() => {
                            handleShowDetails(item)
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell valign='top' sx={{ borderBottom: !!selectedItem && selectedItem.RecordId === item.RecordId ? 'none' : 'unset' }}>
                      <Typography variant='caption'>{`${dayjs(item.EventDate).format('MM/DD/YYYY hh:mm A')}`}</Typography>
                    </TableCell>
                    <TableCell valign='top' align='left' sx={{ borderBottom: !!selectedItem && selectedItem.RecordId === item.RecordId ? 'none' : 'unset' }}>
                      <Typography variant='caption'>{item.Country}</Typography>
                    </TableCell>
                  </TableRow>
                  {!!selectedItem && selectedItem.RecordId === item.RecordId && (
                    <TableRow>
                      <TableCell colSpan={10}>
                        <EconCalendarDetail selectedItem={selectedItem} />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          )}
        </Table>
      </ScrollableBox>
    </Box>
  )
}

export const translateDetailValue = (num: number | null, units: string | null) => {
  if (!num && !units) {
    return ''
  }
  if (!!units) {
    switch (units) {
      case 'thousand':
        return `${numeral(num! * 1000).format('0,0')}`
      case 'percent':
        return `${numeral(num).format('0,0.00')}%`
      case 'trillion':
        return `${numeral(num).format('0,0.00')} ${units}`
      default:
        return `${num} ${units}`
    }
  }
  return `${num}`
}

const filterItems = (items: EconCalendarItem[], filter?: EconCalendarFilter | null) => {
  let result: EconCalendarItem[] = [...items]
  if (!!filter) {
    if (filter.country && filter.country !== 'all') {
      result = items.filter((m) => m.Country === filter.country)
    }
  }

  return result
}

export default EconCalendarDisplay

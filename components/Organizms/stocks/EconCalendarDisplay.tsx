import { Box, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import dayjs from 'dayjs'
import { EconCalendarBody } from './EconCalendarLayout'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import ArrowLeftButton from 'components/Atoms/Buttons/ArrowLeftButton'
import ArrowRightButton from 'components/Atoms/Buttons/ArrowRightButton'
import { DateRange, EconCalendarItem } from 'lib/backend/api/qln/qlnApi'
import FilterListAltIcon from '@mui/icons-material/FilterListAlt'
import FilterListOffIcon from '@mui/icons-material/FilterListOff'
import { useState } from 'react'
import { DropdownItem } from 'lib/models/dropdown'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import { sortArray } from 'lib/util/collections'

dayjs.extend(isSameOrAfter)

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
}: {
  apiResult?: EconCalendarBody
  selectedDate: string
  onChangeDate: (dt: string) => void
  availableDates: DateRange
}) => {
  const { econCalendarSettings, setEconCalendarSettings } = useLocalStore()
  const countries = new Set(apiResult?.Items.flatMap((m) => m.Country))
  const availableCountries = Array.from(countries.values())
  const countryOptions: DropdownItem[] = availableCountries.map((m) => {
    return {
      text: m,
      value: m,
    }
  })

  const countryDropdown = [{ text: 'All', value: 'all' }, ...sortArray(countryOptions, ['text'], ['asc'])]

  const filteredItems = filterItems(apiResult?.Items ?? [], econCalendarSettings?.filter)

  const handleBackClick = () => {
    onChangeDate(dayjs(selectedDate).subtract(1, 'days').format())
  }
  const handleNextClick = () => {
    onChangeDate(dayjs(selectedDate).add(1, 'days').format())
  }
  const handleShowDetails = (item: EconCalendarItem) => {}

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
        <Typography>{dayjs(selectedDate).format('MM/DD/YYYY')}</Typography>
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
                selectedItem={countryDropdown.find((m) => m.value === econCalendarSettings?.filter?.country) ?? countryDropdown[0]}
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
                <TableRow key={item.RecordId}>
                  <TableCell>
                    <ListHeader
                      text={item.TypeName}
                      onClicked={() => {
                        handleShowDetails(item)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='caption'>{`${dayjs(item.EventDate).format('MM/DD/YYYY hh:mm A')}`}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='caption'>{item.Country}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </ScrollableBox>
    </Box>
  )
}

const filterItems = (items: EconCalendarItem[], filter?: EconCalendarFilter | null) => {
  let result: EconCalendarItem[] = [...items]
  if (!!filter) {
    if (filter.country && filter.country !== 'all') {
      result = items.filter((m) => m.Country === filter.country)
    }
  }
  if (result.length === 0) {
    return [...items]
  }
  return result
}

export default EconCalendarDisplay

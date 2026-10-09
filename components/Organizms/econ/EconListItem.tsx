import { Box, Typography } from '@mui/material'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { useEffect, useRef, useState } from 'react'
import EconLastPrevChange from '../widgets/econ/EconLastPrevChange'
import { getEconDataReport, getEconDataReportByDateRange } from 'lib/backend/api/qln/qlnApi'
import dayjs from 'dayjs'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import EconDataDetails from './EconDataDetails'
import { ustreasuries } from 'lib/backend/markets/economicIndicators'

const EconListItem = ({ item }: { item: EconomicDataItem }) => {
  const [selectedItem, setSelectedItem] = useState<EconomicDataItem | null>(null)
  const [details, setDetails] = useState<EconomicDataItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const scrollTarget = useRef<HTMLSpanElement | null>(null)

  const handleItemClicked = async (clickedItem: EconomicDataItem) => {
    if (selectedItem) {
      setSelectedItem(null)
    } else {
      setSelectedItem(clickedItem)
      setIsLoading(true)
      const startYear = dayjs().subtract(10, 'years').year()

      const lastObsYear = dayjs(clickedItem.LastObservationDate!).year()
      const data = await getEconDataReportByDateRange(clickedItem.InternalId, dayjs().subtract(10, 'years').format(), dayjs().format())
      const endDt = item.LastObservationDate!

      let startDt = dayjs().subtract(10, 'years').format()
      if (ustreasuries.includes(item.InternalId)) {
        startDt = dayjs().subtract(5, 'years').format()
      }
      data.criteria = {
        id: String(data.InternalId),
        startYear: startYear,
        endYear: lastObsYear,
        startDt: startDt,
        endDt: endDt,
      }
      setIsLoading(false)
      setDetails(data)
    }
  }
  useEffect(() => {
    const fn = async () => {
      if (selectedItem) {
        if (scrollTarget.current) {
          scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    fn()
  }, [selectedItem])

  return (
    <Box>
      <ListHeader text={item.Title} item={item} onClicked={handleItemClicked} fadeIn={false} selected={!!selectedItem} />

      <Box pl={1}>
        <Box pt={1}>
          <EconLastPrevChange item={item} />
        </Box>
      </Box>
      <Typography ref={scrollTarget} sx={{ position: 'absolute', mt: -19 }}></Typography>
      {selectedItem && (
        <>
          <Box minHeight={650} py={4} pl={2}>
            {isLoading && <ComponentLoader />}
            {details && <EconDataDetails item={details} showLast={false} showYearSelect={false} />}
          </Box>
        </>
      )}
    </Box>
  )
}

export default EconListItem

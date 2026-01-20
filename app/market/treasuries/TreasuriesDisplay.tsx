'use client'
import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import ScrollIntoView from 'components/Atoms/Boxes/ScrollIntoView'
import CloseIconButton from 'components/Atoms/Buttons/CloseIconButton'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import EconDataDetails from 'components/Organizms/econ/EconDataDetails'
import EconDataTable from 'components/Organizms/econ/EconDataTable'
import dayjs from 'dayjs'
import { getEconDataReport } from 'lib/backend/api/qln/qlnApi'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { useState } from 'react'

const TreasuriesTable = ({ data }: { data: EconomicDataItem[] }) => {
  const [selectedItem, setSelectedItem] = useState<EconomicDataItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleItemClicked = async (item: EconomicDataItem) => {
    if (selectedItem && selectedItem.InternalId === item.InternalId) {
      setSelectedItem(null)
      return
    }
    setIsLoading(true)
    const endYear = dayjs(item.LastObservationDate!).year()
    const startYear = dayjs(item.LastObservationDate!).subtract(5, 'years').year()
    const report = await getEconDataReport(item.InternalId, startYear, endYear)
    report.criteria = {
      id: String(report.InternalId),
      endYear: Number(endYear),
      startYear: Number(startYear),
    }
    report.Title = item.Title
    setSelectedItem(report)
    setIsLoading(false)
  }
  return (
    <Box>
      {isLoading && <ComponentLoader />}
      {!selectedItem && <EconDataTable data={data} handleItemClicked={handleItemClicked} />}

      {selectedItem && (
        <Box>
          <CenteredHeader title={selectedItem.Title} />
          <Box display={'flex'} justifyContent={'flex-end'}>
            <CloseIconButton onClicked={() => setSelectedItem(null)} />
          </Box>
          <ScrollIntoView margin={-22} />
          <EconDataDetails item={selectedItem} onClose={() => setSelectedItem(null)} />
        </Box>
      )}
    </Box>
  )
}

export default TreasuriesTable

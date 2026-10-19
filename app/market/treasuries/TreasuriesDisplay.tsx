'use client'
import { Box } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import CloseIconButton from 'components/Atoms/Buttons/CloseIconButton'
import EconDataDetails from 'components/Organizms/econ/EconDataDetails'
import EconDataTable from 'components/Organizms/econ/EconDataTable'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import { useState } from 'react'

const TreasuriesTable = ({ data }: { data: EconomicDataItem[] }) => {
  const [selectedItem, setSelectedItem] = useState<EconomicDataItem | null>(null)

  return (
    <Box>
      {!selectedItem && <EconDataTable data={data} />}
      {selectedItem && (
        <Box>
          <CenteredHeader title={selectedItem.Title} />
          <Box display={'flex'} justifyContent={'flex-end'}>
            <CloseIconButton onClicked={() => setSelectedItem(null)} />
          </Box>
          <EconDataDetails item={selectedItem} />
        </Box>
      )}
    </Box>
  )
}

export default TreasuriesTable

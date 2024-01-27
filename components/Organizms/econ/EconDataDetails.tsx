import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'
import EconDataChart from './EconDataChart'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import dayjs from 'dayjs'
import numeral from 'numeral'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const EconDataDetails = ({ item }: { item: EconomicDataItem }) => {
  return (
    <Box p={1}>
      {item.Chart && <EconDataChart chart={item.Chart} />}
      <Box py={2}>
        <ReadOnlyField label={'current value'} val={numeral(item.Value).format('###,###.0,00')} />
        <ReadOnlyField label='start date' val={dayjs(item.FirstObservationDate).format('MM/DD/YYYY')} />
        <ReadOnlyField label='end date' val={dayjs(item.LastObservationDate).format('MM/DD/YYYY')} />
      </Box>
    </Box>
  )
}

export default EconDataDetails

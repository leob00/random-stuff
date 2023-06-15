import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import ApexAreaLineChart from 'components/Molecules/Charts/apex/ApexAreaLineChart'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import dayjs from 'dayjs'
import { LineChart } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

const JobDetailChart = ({ data }: { data: LineChart }) => {
  const filtered = data.RawData!.filter((m) => dayjs(m.DateCompleted).isAfter(dayjs().subtract(90, 'days')))
  const xyValues: XyValues = {
    x: filtered.map((m) => dayjs(m.DateCompleted).format('MM/DD/YYYY hh:mm a')),
    y: filtered.map((m) => Number(m.TotalMinutes)),
  }
  return (
    <Box>
      <CenterStack>
        <Typography variant='caption'>average run time in minutes</Typography>
      </CenterStack>
      <ApexAreaLineChart xyValues={xyValues} isXmall={true} />
    </Box>
  )
}

export default JobDetailChart

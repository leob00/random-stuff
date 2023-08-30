import { Box, Typography, useTheme } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import ApexAreaLineChart from 'components/Molecules/Charts/apex/ApexAreaLineChart'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import dayjs from 'dayjs'
import { LineChart } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

const JobDetailChart = ({ data }: { data: LineChart }) => {
  const theme = useTheme()
  const filtered = data.RawData!.filter((m) => dayjs(m.DateCompleted).isAfter(dayjs().subtract(90, 'days')))
  const xyValues: XyValues = {
    x: filtered.map((m) => dayjs(m.DateCompleted).format('MM/DD/YYYY hh:mm a')),
    y: filtered.map((m) => Number(Number(m.TotalMinutes).toFixed(1))),
  }
  return (
    <Box>
      <CenterStack>
        <Typography variant='caption'>average run time in minutes</Typography>
      </CenterStack>
      <ApexAreaLineChart xyValues={xyValues} isXmall={true} paletteMode={theme.palette.mode} />
    </Box>
  )
}

export default JobDetailChart

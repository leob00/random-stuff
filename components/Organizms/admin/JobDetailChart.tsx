import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import ApexAreaLineChart from 'components/Molecules/Charts/apex/ApexAreaLineChart'
import { XyValues } from 'components/Molecules/Charts/apex/models/chartModes'
import { LineChart } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

const JobDetailChart = ({ data }: { data: LineChart }) => {
  const xyValues: XyValues = {
    x: data.XValues,
    y: data.YValues.map((i) => Number(i)),
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

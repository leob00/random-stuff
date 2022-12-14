import { Close } from '@mui/icons-material'
import { Box, Button, Grid, Stack } from '@mui/material'
import BasicBarChart from 'components/Atoms/Charts/BasicBarChart'
import BasicPieChart from 'components/Atoms/Charts/BasicPieChart'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import { BarChart } from 'components/Molecules/Charts/barChartOptions'
import React from 'react'

const GoalCharts = ({ barChart, handleCloseCharts }: { barChart: BarChart; handleCloseCharts: () => void }) => {
  return (
    <>
      <Box py={2}>
        <HorizontalDivider />
        <Stack display={'flex'} direction={'row'} justifyContent={'flex-end'}>
          <Button onClick={handleCloseCharts}>
            <Close />
          </Button>
        </Stack>
        <CenteredTitle title='All Tasks By Status' />
        <Box>
          <Grid container spacing={1} justifyContent={'center'} alignItems={'flex-end'}>
            <Grid item xs={12} md={4}>
              <Box>
                <BasicPieChart barChart={barChart} title={''} />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box>
                <BasicBarChart barChart={barChart} title={''} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default GoalCharts

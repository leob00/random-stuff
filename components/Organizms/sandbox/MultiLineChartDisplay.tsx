import { Box, useTheme } from '@mui/material'
import MultiLineChart from 'components/Atoms/Charts/apex/MultiLineChart'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { XyValues } from 'components/Atoms/Charts/apex/chartModels'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getEconDataReportDowJones, getEconDataReportSnp } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

const MultiLineChartDisplay = () => {
  const econChartFn = async () => {
    const xyVaues: XyValues[] = []
    const startYear = dayjs().add(-1, 'years').year()
    const endYear = dayjs().year()
    const snp = await getEconDataReportSnp(startYear, endYear)
    const snpChart: XyValues = {
      name: 'S&P 500',
      x: snp.Chart!.XValues,
      y: snp.Chart!.YValues.map((m) => Number(m)),
    }
    const dj = await getEconDataReportDowJones(startYear, endYear)
    const djChart: XyValues = {
      name: 'Dow Jones Industrial Average',
      x: dj.Chart!.XValues,
      y: dj.Chart!.YValues.map((m) => Number(m)),
    }
    xyVaues.push(djChart)
    xyVaues.push(snpChart)
    return xyVaues
  }

  const econChartMutateKey = `chart-DJSNP`

  const { data: econData, isLoading } = useSwrHelper(econChartMutateKey, econChartFn, { revalidateOnFocus: false })

  return (
    <>
      {isLoading && <BackdropLoader />}
      <Box>
        {econData && (
          <>
            <MultiLineChart xYValues={econData} yLabelPrefix={''} />
          </>
        )}
      </Box>
    </>
  )
}

export default MultiLineChartDisplay

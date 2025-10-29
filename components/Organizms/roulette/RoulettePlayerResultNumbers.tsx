import { Typography, Box, useTheme } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { ChartBackground, CasinoBlueTransparent } from 'components/themes/mainTheme'
import { translateCasinoColor } from 'lib/backend/charts/barChartMapper'
import { RouletteNumber } from 'lib/backend/roulette/wheel'
import React from 'react'

const RoulettePlayerResultNumbers = ({ data }: { data: RouletteNumber[] }) => {
  const theme = useTheme()
  let bkgColor = theme.palette.mode === 'dark' ? theme.palette.primary.contrastText : ChartBackground

  return (
    <>
      <CenterStack sx={{ my: 1 }}>
        <Typography variant='body1' sx={{}}>{`player spins`}</Typography>
      </CenterStack>
      <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
        <Box display={'flex'} gap={1} flexWrap={'wrap'} alignItems={'center'}>
          {data.map((item, index) => (
            <Box key={index} display={'flex'}>
              <Box bgcolor={bkgColor} border={`1px solid ${CasinoBlueTransparent}`} borderRadius={'50%'} p={2} textAlign='center' width={68}>
                <Typography variant='h5' sx={{ color: translateCasinoColor(item.color) }}>
                  {item.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  )
}

export default RoulettePlayerResultNumbers

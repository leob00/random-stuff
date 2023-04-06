import { Typography, Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { ChartBackground, CasinoBlueTransparent } from 'components/themes/mainTheme'
import { translateCasinoColor } from 'lib/backend/charts/barChartMapper'
import { RouletteNumber } from 'lib/backend/roulette/wheel'
import React from 'react'

const RoulettePlayerResultNumbers = ({ data }: { data: RouletteNumber[] }) => {
  return (
    <>
      <CenterStack sx={{ my: 1 }}>
        <Typography variant='body1' sx={{}}>{`player spins`}</Typography>
      </CenterStack>
      <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
        <Box display={'flex'} gap={1} flexWrap={'wrap'} alignItems={'center'}>
          {data.map((item, index) => (
            <Box key={index} display={'flex'}>
              <Box
                bgcolor={ChartBackground}
                border={index === 0 ? `1px solid ${CasinoBlueTransparent}` : 'unset'}
                borderRadius={'50%'}
                p={2}
                textAlign='center'
                width={60}
              >
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

import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import CommoditiesLayout from '../CommoditiesLayout'

const PreMarketSummary = () => {
  return (
    <Box width={'100%'}>
      <CenterStack>
        <Typography variant='h5'>Commodities</Typography>
      </CenterStack>
      <CommoditiesLayout />
    </Box>
  )
}

export default PreMarketSummary

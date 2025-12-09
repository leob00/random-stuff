import { Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'

const PreMarketSummary = () => {
  return (
    <>
      <CenterStack sx={{ ml: -2 }}>
        <Typography variant='h5'>Pre-Market</Typography>
      </CenterStack>
      <Typography>new item</Typography>
    </>
  )
}

export default PreMarketSummary

import { Box, Skeleton, Typography } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'

const StockTableSkeleton = () => {
  return (
    <Box display={'flex'} gap={1} flexDirection={'column'}>
      {Array.from(new Array(5)).map((_, index) => (
        <Box key={index}>
          <Box key={index} pl={2}>
            <Skeleton variant='text' width={'100%'} height={50} animation='wave'></Skeleton>
          </Box>
          <HorizontalDivider />
        </Box>
      ))}
    </Box>
  )
}

export default StockTableSkeleton

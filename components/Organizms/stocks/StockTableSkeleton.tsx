import { Box, Skeleton, Typography } from '@mui/material'

const StockTableSkeleton = () => {
  return (
    <Box pl={1} display={'flex'} gap={1} flexDirection={'column'}>
      {Array.from(new Array(3)).map((_, index) => (
        <Box key={index}>
          <Skeleton variant='text' width={'100%'} height={48} animation='wave'>
            <Typography variant='h6'></Typography>
          </Skeleton>
        </Box>
      ))}
    </Box>
  )
}

export default StockTableSkeleton

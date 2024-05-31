import { Card, CardHeader, Typography, CardContent, Box, Skeleton, Alert } from '@mui/material'

const StatusSkeleton = () => {
  return (
    <Box py={1}>
      <Card sx={{}}>
        <CardHeader
          title={
            <Skeleton variant='rectangular' width={'80%'}>
              <Typography>&nbsp;</Typography>
            </Skeleton>
          }
        />
        <CardContent>
          <Box display={'flex'} gap={1}>
            <Skeleton variant='rectangular' width={'80%'}>
              <Alert sx={{}} severity='success'>
                online
              </Alert>
            </Skeleton>
            {/* <Skeleton variant='rectangular' width={'100%'} /> */}
            {/* <Typography>&nbsp;</Typography> */}
            {/* <Typography>&nbsp;</Typography> */}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default StatusSkeleton

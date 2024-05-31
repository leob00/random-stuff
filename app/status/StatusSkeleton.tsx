import { Card, CardHeader, Typography, CardContent, Box } from '@mui/material'

const StatusSkeleton = () => {
  return (
    <Box py={1}>
      <Card>
        <CardHeader title={<Typography>&nbsp;</Typography>} />
        <CardContent>
          <Box display={'flex'} gap={1}>
            <Typography>&nbsp;</Typography>
            <Typography>&nbsp;</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default StatusSkeleton

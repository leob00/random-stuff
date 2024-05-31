import { Card, CardHeader, Typography, CardContent, Box } from '@mui/material'
import { StatusResponse } from './statusResponse'

const StatusCard = ({ title, data }: { title: string; data: StatusResponse }) => {
  return (
    <Card>
      <CardHeader title={<Typography>{title}</Typography>} />
      <CardContent>
        <Box display={'flex'} gap={1}>
          <Typography>status:</Typography>
          <Typography>{data.success ? 'online' : 'failed'}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatusCard

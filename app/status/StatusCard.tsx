import { Card, CardHeader, Typography, CardContent, Box, Alert } from '@mui/material'
import { StatusResponse } from './statusResponse'

const StatusCard = ({ title, data }: { title: string; data: StatusResponse }) => {
  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardHeader title={<Typography color='info'>{title}</Typography>} />
      <CardContent>
        <Box display={'flex'} gap={1}>
          {data.success ? (
            <Alert sx={{ width: '80%' }} severity='success'>
              online
            </Alert>
          ) : (
            <Alert sx={{ width: '80%' }} severity='error'>
              offline
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatusCard

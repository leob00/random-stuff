import { Card, CardHeader, Typography, CardContent, Box, Skeleton, Alert, AlertTitle } from '@mui/material'
import AlertWithHeader from 'components/Atoms/Text/AlertWithHeader'

const StatusSkeleton = () => {
  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardHeader
        title={
          <Skeleton variant='rectangular' width={'80%'} sx={{ borderRadius: 4 }}>
            <Typography>&nbsp;</Typography>
          </Skeleton>
        }
      />
      <CardContent>
        <Box display={'flex'} gap={1}>
          <Skeleton variant='rectangular' width={'80%'} sx={{ borderRadius: 4 }}>
            <AlertWithHeader text='onine' severity='success' />
          </Skeleton>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatusSkeleton

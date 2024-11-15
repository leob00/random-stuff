import { Box, Card, CardContent, CardHeader } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'

const DataQualityStart = () => {
  return (
    <Box py={2}>
      <Box display={'flex'} justifyContent={'center'} gap={2} alignItems={'center'} flexWrap={'wrap'}>
        <Card sx={{ width: '25%' }}>
          <CardHeader title={'Earnings'}></CardHeader>
          <HorizontalDivider />
          <CardContent>
            <Box>
              <SiteLink href='/protected/csr/admin/data-quality/earnings' text='manage' />
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ width: '25%' }}>
          <CardHeader title={'Dividends'}></CardHeader>
          <HorizontalDivider />
          <CardContent>
            <Box>
              <SiteLink href='/protected/csr/admin/data-quality/dividends' text='manage' />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
export default DataQualityStart

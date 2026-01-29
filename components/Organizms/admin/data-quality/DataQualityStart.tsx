import { Box, Card, CardContent, CardHeader, Stack } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'

const DataQualityStart = () => {
  return (
    <Box py={2}>
      <Box display={'flex'} justifyContent={'center'} gap={1} alignItems={'center'} flexWrap={'wrap'}>
        <Box sx={{ width: '40%' }}>
          <Card>
            <CardHeader title={'Earnings'}></CardHeader>
            <HorizontalDivider />
            <CardContent>
              <Box>
                <SiteLink href='/admin/data-quality/earnings' text='manage' />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ width: '40%' }}>
          <Card>
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
    </Box>
  )
}
export default DataQualityStart

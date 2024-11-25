import { Box, Card, CardContent } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { Claim } from 'lib/backend/auth/userUtil'
import CacheSettings from './CacheSettings'

const QlnAdministration = ({ claim, handleLogOff }: { claim?: Claim; handleLogOff: () => void }) => {
  return (
    <Box>
      <Card>
        <CardContent>
          <>
            {claim && <CacheSettings claim={claim} />}
            <HorizontalDivider />
            <Box py={2} display={'flex'} justifyContent={'flex-end'}>
              <DangerButton text='Sign out' onClick={handleLogOff} />
            </Box>
          </>
        </CardContent>
      </Card>
    </Box>
  )
}

export default QlnAdministration

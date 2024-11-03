import { Box, Card, CardContent } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import dayjs from 'dayjs'
import { Claim } from 'lib/backend/auth/userUtil'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import CacheSettings from './CacheSettings'

const QlnAdministration = ({
  claim,
  isTokenValid,
  handleLogOff,
  handleQlnLogin,
}: {
  claim?: Claim
  isTokenValid: boolean
  handleLogOff: () => void
  handleQlnLogin: (claims: Claim[]) => void
}) => {
  return (
    <Box>
      <Card>
        <CardContent>
          {isTokenValid && claim !== undefined ? (
            <>
              <CacheSettings claim={claim} />
              <HorizontalDivider />
              <Box py={2} display={'flex'} justifyContent={'flex-end'}>
                <DangerButton text='Sign out' onClick={handleLogOff} />
              </Box>
            </>
          ) : (
            <>
              <QlnUsernameLoginForm onSuccess={handleQlnLogin} />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default QlnAdministration

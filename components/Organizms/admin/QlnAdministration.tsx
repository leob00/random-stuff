import { Box } from '@mui/material'
import { Claim } from 'lib/backend/auth/userUtil'
import CacheSettings from './CacheSettings'

const QlnAdministration = ({ claim, handleLogOff }: { claim?: Claim; handleLogOff: () => void }) => {
  return <Box>{claim && <CacheSettings claim={claim} />}</Box>
}

export default QlnAdministration

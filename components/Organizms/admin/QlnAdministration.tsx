import { Box, Typography } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import dayjs from 'dayjs'
import { getCacheStats, getStockQuotes } from 'lib/backend/api/qln/qlnApi'
import { Claim } from 'lib/backend/auth/userUtil'
import { useSessionPersistentStore } from 'lib/backend/store/useSessionStore'
import React from 'react'
import useSWR, { mutate } from 'swr'
import CacheSettings from './CacheSettings'

const QlnAdministration = () => {
  const { claims, saveClaims } = useSessionPersistentStore()
  let claim = claims.find((m) => m.type === 'qln')
  const isTokenValid = claim && dayjs(claim.tokenExpirationDate).isAfter(dayjs())

  const handleQlnLogin = (claims: Claim[]) => {
    saveClaims(claims)
  }
  const handleLogOff = () => {
    saveClaims([...claims].filter((m) => m.type !== 'qln'))
  }
  return (
    <Box>
      <Box>
        <CenteredTitle title='QLN Admin' />
      </Box>

      {!isTokenValid && <QlnUsernameLoginForm onSuccess={handleQlnLogin} />}
      {isTokenValid && claim && (
        <Box>
          <CacheSettings claim={claim} />
          <Box py={2} display={'flex'} justifyContent={'flex-end'}>
            <SecondaryButton text='log off' onClick={handleLogOff} />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default QlnAdministration

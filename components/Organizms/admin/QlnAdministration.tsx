import { Box, Card, CardContent } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import dayjs from 'dayjs'
import { Claim } from 'lib/backend/auth/userUtil'
import { useSessionPersistentStore } from 'lib/backend/store/useSessionStore'
import React from 'react'
import CacheSettings from './CacheSettings'

const QlnAdministration = () => {
  const { claims, saveClaims } = useSessionPersistentStore()
  let claim = claims.find((m) => m.type === 'qln')
  const isTokenValid = claim && dayjs(claim.tokenExpirationDate).isAfter(dayjs())

  const handleQlnLogin = (newClaims: Claim[]) => {
    saveClaims(newClaims)
  }
  const handleLogOff = () => {
    saveClaims(claims.filter((m) => m.type !== 'qln'))
  }
  return (
    <Box>
      <Card>
        <CardContent>
          {isTokenValid && claim !== undefined ? (
            <>
              <CacheSettings claim={claim} />
              <HorizontalDivider />
              <Box py={2} display={'flex'} justifyContent={'flex-end'}>
                <SecondaryButton text='log off' onClick={handleLogOff} />
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

import { Box, Card, CardContent } from '@mui/material'
import DangerButton from 'components/Atoms/Buttons/DangerButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import QlnUsernameLoginForm from 'components/Molecules/Forms/Login/QlnUsernameLoginForm'
import dayjs from 'dayjs'
import { Claim } from 'lib/backend/auth/userUtil'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import React from 'react'
import CacheSettings from './CacheSettings'

const QlnAdministration = () => {
  const { claims, saveClaims } = useSessionStore()
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

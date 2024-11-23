import { Box, Card, CardContent, Link, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import React from 'react'
import { apiConnection } from 'lib/backend/api/config'
import QlnAdministration from './QlnAdministration'
import CopyableText from 'components/Atoms/Text/CopyableText'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import dayjs from 'dayjs'
import { Claim } from 'lib/backend/auth/userUtil'

const ServerInfo = () => {
  const config = apiConnection().qln
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
    <>
      <Box py={2} minHeight={400}>
        <Box py={2}>
          <FadeIn>
            <QlnAdministration claim={claim} isTokenValid={isTokenValid ?? false} handleLogOff={handleLogOff} handleQlnLogin={handleQlnLogin} />
          </FadeIn>
        </Box>
        <FadeIn>
          <Card>
            <CardContent>
              <Box py={2}>
                <Typography variant='h5' pb={2} color='primary'>{`Configuration`}</Typography>
                <CenterStack sx={{ pt: 1 }}>
                  <Link target='_blank' href={'https://server6.m6.net:8443/'} style={{ fontSize: 'smaller' }}>
                    Web Server Administration
                  </Link>
                </CenterStack>
                <CenterStack sx={{ pt: 2 }}>
                  <ReadOnlyField label='Database' val='192.99.150.165' />
                </CenterStack>
                <CenterStack sx={{ pt: 2 }}>
                  <CopyableText label='Api url:' value={config.url} />
                </CenterStack>
                <CenterStack sx={{ pt: 2 }}>
                  <CopyableText label='Api key:' value={config.key} />
                </CenterStack>
              </Box>
            </CardContent>
          </Card>
        </FadeIn>
      </Box>
    </>
  )
}

export default ServerInfo

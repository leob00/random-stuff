import { Box, Card, CardContent, Link, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import React from 'react'
import { apiConnection } from 'lib/backend/api/config'
import QlnAdministration from './QlnAdministration'
import CopyableText from 'components/Atoms/Text/CopyableText'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import { useSessionStore } from 'lib/backend/store/useSessionStore'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'
import { CasinoBlueTransparent } from 'components/themes/mainTheme'

const ServerInfo = () => {
  const config = apiConnection().qln
  const { claims, saveClaims } = useSessionStore()
  let claim = claims.find((m) => m.type === 'qln')

  const handleLogOff = () => {
    saveClaims(claims.filter((m) => m.type !== 'qln'))
  }

  return (
    <Box display={'flex'} flexDirection={'column'} gap={1}>
      <QlnAdministration claim={claim} handleLogOff={handleLogOff} />
      <Box sx={{ border: `solid ${CasinoBlueTransparent} 1px` }} borderRadius={1} p={2}>
        <Box py={2} display={'flex'} flexDirection={'column'} gap={2}>
          <Typography variant='h5' color='primary'>{`Configuration`}</Typography>
          <Link target='_blank' href={'https://server6.m6.net:8443/'} style={{ fontSize: 'smaller' }}>
            Administer QLN
          </Link>
          <ReadOnlyField label='Database' val='192.99.150.165' />
          <CopyableText label='Api url:' value={config.url} />
          <CopyableText label='Api key:' value={config.key} />
        </Box>
        <Box py={2}>
          <SiteLink href='/status' text='status' />
        </Box>
      </Box>
    </Box>
  )
}

export default ServerInfo

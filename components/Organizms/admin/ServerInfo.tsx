import { Box, IconButton, Link, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import React from 'react'
import { apiConnection } from 'lib/backend/api/config'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import QlnAdministration from './QlnAdministration'
import CopyableText from 'components/Atoms/Text/CopyableText'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'

const ServerInfo = () => {
  const config = apiConnection().qln

  return (
    <>
      <Box py={2}>
        <CenteredHeader title='Quote Lookup .NET' />
        <Box py={2}>
          <QlnAdministration />
        </Box>
        <Box>
          <CenterStack sx={{ py: 2 }}>
            <SiteLink href='/status' text='status' />
          </CenterStack>
          <CenterStack sx={{ pt: 1 }}>
            <Link href={'https://server6.m6.net:8443/'} style={{ fontSize: 'smaller' }}>
              Web Server Administration
            </Link>
          </CenterStack>
          <CenterStack sx={{ pt: 2 }}>
            <ReadOnlyField label='Database' val='192.99.150.165' />
          </CenterStack>
          <CenterStack sx={{ pt: 2 }}>
            <CopyableText label='Api url:' value={config.url} showValue />
          </CenterStack>
          <CenterStack sx={{ pt: 2 }}>
            <CopyableText label='Api key:' value={config.key} />
          </CenterStack>
        </Box>
      </Box>
    </>
  )
}

export default ServerInfo

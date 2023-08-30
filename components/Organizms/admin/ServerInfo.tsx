import { Box, IconButton, Link, Typography } from '@mui/material'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import InternalLink from 'components/Atoms/Buttons/InternalLink'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import React from 'react'
import { apiConnection } from 'lib/backend/api/config'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'

const ServerInfo = () => {
  const config = apiConnection().qln
  const [showCopyConfirm, setShowCopyConfirm] = React.useState(false)

  const handleCopyItem = (item: string) => {
    navigator.clipboard.writeText(item)
    setShowCopyConfirm(true)
  }
  React.useEffect(() => {
    if (showCopyConfirm) {
      setTimeout(() => {
        setShowCopyConfirm(false)
      }, 2000)
    }
  }, [showCopyConfirm])

  return (
    <Box py={2}>
      <CenteredHeader title='Random Stuff' />
      <CenterStack sx={{ py: 2 }}>
        <InternalLink text='health check' route={'/ssr/healthcheck'} />
      </CenterStack>
      <HorizontalDivider />
      <CenteredHeader title='Quote Lookup .NET' />
      <CenterStack sx={{ pt: 1 }}>
        <Link href={'https://server6.m6.net:8443/'} target={'_blank'} color='primary'>
          <Typography>Web Server Administration</Typography>
        </Link>
      </CenterStack>
      <CenterStack sx={{ pt: 2 }}>
        <Typography>Database: 192.99.150.165</Typography>
      </CenterStack>
      <CenterStack sx={{ pt: 2 }}>
        <Typography pr={2}>Api url:</Typography>
        <Typography pr={2}>{config.url}</Typography>
        <IconButton size='small' onClick={() => handleCopyItem(config.url)}>
          <ContentCopyIcon fontSize='small' />
        </IconButton>
      </CenterStack>
      <CenterStack sx={{ pt: 2 }}>
        <Typography pr={2}>Api key:</Typography>
        <IconButton size='small' onClick={() => handleCopyItem(config.key)}>
          <ContentCopyIcon fontSize='small' />
        </IconButton>
      </CenterStack>
      {showCopyConfirm && <SnackbarSuccess show={true} text={'copied!'} />}
    </Box>
  )
}

export default ServerInfo

import { Box } from '@mui/material'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import React from 'react'
import SiteLink from './app/server/Atoms/Links/SiteLink'

const HeaderLinks = ({ ticket }: { ticket: AmplifyUser | null }) => {
  return (
    <Box display='flex' gap={{ xs: 1, sm: 2 }} alignItems={'center'}>
      <Box>
        <SiteLink href='/' text={'home'} />
      </Box>
      <Box>
        <SiteLink href='/csr/news' text={'news'} />
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'unset' } }}>
        <SiteLink href='/ssg/recipes' text={'recipes'} />
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'unset' } }}>
        {ticket ? <SiteLink href='/csr/my-stocks' text={'stocks'} /> : <SiteLink href='/csr/community-stocks' text={'stocks'} />}
      </Box>
    </Box>
  )
}

export default HeaderLinks

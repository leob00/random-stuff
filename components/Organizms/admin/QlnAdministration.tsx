import { Box, Typography } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import { Claim } from 'lib/backend/auth/userUtil'
import React from 'react'

const QlnAdministration = ({ claim }: { claim: Claim }) => {
  return (
    <Box>
      <JsonView obj={claim} />
    </Box>
  )
}

export default QlnAdministration

import { Alert, Box, Grid, Typography } from '@mui/material'
import { CasinoLightPinkTransparent } from 'components/themes/mainTheme'
import React from 'react'
import CenterStack from '../CenterStack'

const WarningMessage = ({ text }: { text: string }) => {
  return (
    <>
      <Box py={4}>
        <CenterStack>
          <Alert color='warning'>{text}</Alert>
        </CenterStack>
      </Box>
    </>
  )
}

export default WarningMessage

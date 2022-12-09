import { Grid, Typography } from '@mui/material'
import { CasinoLightPinkTransparent } from 'components/themes/mainTheme'
import React from 'react'
import CenterStack from '../CenterStack'

const ErrorMessage = ({ text }: { text: string }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={0} md={2}></Grid>
      <Grid item>
        <CenterStack sx={{ backgroundColor: CasinoLightPinkTransparent, padding: 4, borderRadius: 4 }}>
          <Typography color='error' variant='subtitle1'>
            {text}
          </Typography>
        </CenterStack>
      </Grid>
    </Grid>
  )
}

export default ErrorMessage

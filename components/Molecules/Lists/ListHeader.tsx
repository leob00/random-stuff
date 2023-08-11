import { Button, Paper, Stack, Typography, useTheme } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import { ChartBackground, DarkBlue, DarkBlueTransparent } from 'components/themes/mainTheme'
import React from 'react'

const ListHeader = ({
  text,
  item,
  onClicked,
  backgroundColor = ChartBackground,
}: {
  text: string
  item: any
  onClicked: (item: any) => void
  backgroundColor?: string
}) => {
  const theme = useTheme()
  return (
    <Stack
      //pt={1}
      sx={{ cursor: 'pointer', mt: 1 }}
      onClick={(e) => {
        onClicked(item)
      }}
    >
      <Stack sx={{ backgroundColor: theme.palette.mode === 'dark' ? DarkBlue : backgroundColor }} direction={'row'} flexGrow={1} px={2} py={1}>
        <Typography textAlign={'left'} variant='h5' color={'primary'} sx={{ textDecoration: 'unset' }}>
          {text}
        </Typography>
      </Stack>
    </Stack>
  )
}

export default ListHeader

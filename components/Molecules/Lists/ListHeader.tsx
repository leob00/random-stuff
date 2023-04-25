import { Stack, Typography } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import { ChartBackground, DarkBlue } from 'components/themes/mainTheme'
import React from 'react'

const ListHeader = ({ text, item, onClicked }: { text: string; item: any; onClicked: (item: any) => void }) => {
  return (
    <Stack direction={'row'} alignItems={'flex-start'} display={'flex'} pt={1} justifyContent={'space-between'}>
      <Stack sx={{ backgroundColor: ChartBackground }} direction={'row'} flexGrow={1} ml={-2} px={2} py={1}>
        <LinkButton
          onClick={(e) => {
            onClicked(item)
          }}
        >
          <Typography textAlign={'left'} variant='h6' fontWeight={600} color={DarkBlue} sx={{ textDecoration: 'unset' }}>
            {text}
          </Typography>
        </LinkButton>
      </Stack>
    </Stack>
  )
}

export default ListHeader

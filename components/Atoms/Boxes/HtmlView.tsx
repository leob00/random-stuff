import React from 'react'
import styled from '@emotion/styled'
import { useMediaQuery, Typography, useTheme } from '@mui/material'
import theme, { CasinoBlue, CasinoRed, DarkBlue } from 'components/themes/mainTheme'
const HtmlView = ({ html }: { html: string }) => {
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const currTheme = useTheme()
  //console.log('palette mode: ', currTheme.palette.mode)
  const text = html.replaceAll('font color="#6f6f6f"', `font color="${DarkBlue}"`)

  const StyledBox = styled(Typography)(() => ({
    img: {
      width: isXSmall ? 280 : 'unset',
      borderRadius: '16px',
      marginTop: 1,
      margin: 'auto',
    },
    font: CasinoBlue,
    a: { color: CasinoBlue },
    p: { width: isXSmall ? 300 : 'unset', color: CasinoBlue, fontSize: 20, fontWeight: 600 },
  }))
  return (
    <>
      {html ? (
        <StyledBox
          display={'flex'}
          justifyContent={'center'}
          sx={{
            width: { xs: 270, md: 'unset' },
            display: 'inline-block',
            wordWrap: 'break-word',
            color: CasinoBlue,
            fontWeight: 500,
            backgroundColor: 'white',
          }}
          variant='body1'
          color='primary'
          dangerouslySetInnerHTML={{ __html: text }}
        ></StyledBox>
      ) : (
        <></>
      )}
    </>
  )
}

export default HtmlView

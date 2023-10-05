import React from 'react'
import styled from '@emotion/styled'
import { useMediaQuery, Box, useTheme } from '@mui/material'
import { CasinoBlue, DarkBlue, VeryLightBlue } from 'components/themes/mainTheme'
const HtmlView = ({ html, textAlign = 'center' }: { html: string; textAlign?: 'left' | 'center' | 'right' }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const darkColor = theme.palette.mode === 'dark' ? VeryLightBlue : DarkBlue
  const color = theme.palette.mode === 'dark' ? VeryLightBlue : CasinoBlue
  const text = html.replaceAll('font color="#6f6f6f"', `font color="${darkColor}"`)

  const StyledBox = styled(Box)(() => ({
    img: {
      width: isXSmall ? 280 : 600,
      borderRadius: '16px',
      marginTop: 1,
      margin: 'auto',
    },
    //div: { backgroundColor: 'unset' },
    font: color,
    a: { color: color },
    p: { color: color, fontSize: 20, fontWeight: 600 },
  }))

  return (
    <>
      {html ? (
        <StyledBox
          display={'flex'}
          textAlign={textAlign}
          justifyContent={textAlign}
          justifyItems={textAlign}
          sx={{
            borderRadius: '16px',
            padding: 2,
            maxWidth: { xs: '95%', md: '98%' },
            display: 'inline-block',
            // wordWrap: 'break-word',
            color: color,
            fontWeight: 500,
            //backgroundColor: 'white',
          }}
          //variant='body1'
          color='primary'
          dangerouslySetInnerHTML={{ __html: text }}></StyledBox>
      ) : (
        <></>
      )}
    </>
  )
}

export default HtmlView

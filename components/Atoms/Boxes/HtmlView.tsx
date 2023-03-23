import React from 'react'
import styled from '@emotion/styled'
import { useMediaQuery, Typography } from '@mui/material'
import theme from 'components/themes/mainTheme'
const HtmlView = ({ html }: { html?: string }) => {
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const StyledBox = styled(Typography)(() => ({
    //const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
    img: {
      width: isXSmall ? 280 : 'unset',
      borderRadius: '16px',
      marginTop: 1,
    },
    p: { width: isXSmall ? 300 : 'unset' },
  }))
  return (
    <>
      {html ? (
        <StyledBox sx={{ width: { xs: 300, md: 'unset' } }} variant='body1' color='primary' dangerouslySetInnerHTML={{ __html: html }}></StyledBox>
      ) : (
        <></>
      )}
    </>
  )
}

export default HtmlView

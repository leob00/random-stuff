import { useMediaQuery, Box, useTheme, styled } from '@mui/material'
import { DarkBlue } from 'components/themes/mainTheme'
const HtmlView = ({ html, textAlign = 'center' }: { html: string; textAlign?: 'left' | 'center' | 'right' }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const darkColor = theme.palette.mode === 'dark' ? '#90caf9' : DarkBlue
  const text = html.replaceAll('font color="#6f6f6f"', `font color="${darkColor}"`)

  const StyledBox = styled(Box)(() => ({
    img: {
      width: isXSmall ? 280 : 600,
      borderRadius: '16px',
      marginTop: 1,
      margin: 'auto',
    },
    div: { a: { color: theme.palette.primary.main, target: '_blank', rel: 'noopener noreferrer' } },
    //font: color,
    color: theme.palette.primary.main,
    a: { color: theme.palette.primary.main, target: '_blank', rel: 'noopener noreferrer' },
    p: { color: theme.palette.primary.main, fontSize: 20 },
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
            //border: `solid ${theme.palette.primary.main} 1px`,
            padding: 2,
            width: { xs: '100%', md: '98%' },
            display: 'inline-block',
            // wordWrap: 'break-word',
            //color: color,
            fontWeight: 200,
            //backgroundColor: 'white',
          }}
          //variant='body1'
          //color='primary'
          dangerouslySetInnerHTML={{ __html: text }}
        ></StyledBox>
      ) : (
        <></>
      )}
    </>
  )
}

export default HtmlView

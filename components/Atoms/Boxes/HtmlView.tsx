import { useMediaQuery, Box, useTheme, styled } from '@mui/material'
import { DarkBlue } from 'components/themes/mainTheme'
const HtmlView = ({ html, textAlign = 'center' }: { html: string; textAlign?: 'left' | 'center' | 'right' }) => {
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const darkColor = theme.palette.mode === 'dark' ? '#90caf9' : DarkBlue
  let text = html.replaceAll('font color="#6f6f6f"', `font color="${darkColor}"`)

  const addTargetToExternalLinks = (htmlStr: string) => {
    return htmlStr.replace(/<a\s+([^>]*?)href=(["'])(https?:\/\/[^"']+)\2([^>]*)>/gi, (m, pre, q, url, post) => {
      const attrs = (pre + ' ' + post).trim()
      if (/\btarget=/.test(attrs)) return m
      const relAttr = /\brel=/.test(attrs) ? '' : ' rel="noopener noreferrer"'
      return `<a ${pre}href=${q}${url}${q}${post} target="_blank"${relAttr}>`
    })
  }

  text = addTargetToExternalLinks(text)
  text = `<html><div>${text}</div></html>`

  const StyledBox = styled(Box)(() => ({
    img: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '16px',
      marginTop: 1,
      margin: 'auto',
    },
    'figure img': {
      maxWidth: 320,
      maxHeight: 220,
      width: '100%',
      height: 'auto',
      borderRadius: '16px',
    },
    //div: { a: { color: theme.palette.primary.main } },
    //color: theme.palette.info.main,
    a: { color: theme.palette.info.main },
  }))

  return (
    <Box>
      {html ? (
        <StyledBox
          display={'flex'}
          textAlign={textAlign}
          justifyContent={textAlign}
          justifyItems={textAlign}
          sx={{
            borderRadius: '16px',
            padding: 2,
            width: { xs: '100%', md: '98%' },
            display: 'inline-block',
            wordWrap: 'break-word',
            color: theme.palette.info.main,
            fontWeight: 400,
            //backgroundColor: 'white',
          }}
          dangerouslySetInnerHTML={{ __html: text }}
        ></StyledBox>
      ) : (
        <></>
      )}
    </Box>
  )
}

export default HtmlView

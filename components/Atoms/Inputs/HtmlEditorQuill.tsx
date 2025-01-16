import 'react-quill-new/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { Box, styled, useMediaQuery, useTheme } from '@mui/material'
import { CasinoBlue, DarkBlue, DarkModeBkg, VeryLightBlue, VeryLightBlueTransparent } from 'components/themes/mainTheme'

const HtmlEditorQuill = ({ value, onChanged }: { value: string; onChanged: (text: string) => void }) => {
  const QuillNoSSRWrapper = useMemo(() => dynamic(() => import('react-quill-new'), { ssr: false }), [])
  const theme = useTheme()
  const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const darkColor = theme.palette.mode === 'dark' ? '#90caf9' : DarkBlue
  const color = theme.palette.mode === 'dark' ? '#90caf9' : CasinoBlue

  const StyledBox = styled(Box)(() => ({
    span: {
      color: theme.palette.mode === 'dark' ? VeryLightBlue : DarkModeBkg,
    },
    img: {
      //width: isXSmall ? 280 : 600,
      borderRadius: '16px',
      marginTop: 1,
      //margin: 'auto',
    },
    //div: { backgroundColor: 'unset' },
    //font: color,
    color: color,
    a: { color: color },
    p: { color: color, fontSize: 20 },
    borderRadius: '16px',
    border: `solid ${VeryLightBlueTransparent} 1px`,
    minHeight: 500,
  }))
  return (
    <>
      <QuillNoSSRWrapper style={{ height: 280, width: '100%' }} value={value} onChange={(e) => onChanged(e)} />
    </>
  )
}

export default HtmlEditorQuill

import React from 'react'
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import WarmupBox from 'components/Atoms/WarmupBox'
import mainTheme from 'components/themes/mainTheme'
import { TMUIRichTextEditorRef } from 'mui-rte'
import theme from 'components/themes/mainTheme'
import { ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'

const HtmlEditorNoSSRWrapper = dynamic(import('mui-rte'), {
  ssr: false,
  loading: () => <WarmupBox />,
})

const HtmlEditor = ({ value, onChanged }: { value: string; onChanged: (text: string) => void }) => {
  //const editorRef = React.useRef<TMUIRichTextEditorRef | null>(null)
  const save = (data: string) => {
    console.log(data)
    //onChanged(data)
  }
  const myTheme = createTheme({
    // Set up your custom MUI theme here
  })

  return (
    <ThemeProvider theme={myTheme}>
      <HtmlEditorNoSSRWrapper label='type something' defaultValue={value} onSave={save} />
    </ThemeProvider>
  )
}

export default HtmlEditor

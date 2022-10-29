import React from 'react'
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import WarmupBox from 'components/Atoms/WarmupBox'
import mainTheme from 'components/themes/mainTheme'
import { TMUIRichTextEditorRef } from 'mui-rte'
import theme from 'components/themes/mainTheme'
import { ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import { ContentBlock, ContentState, convertFromRaw, convertToRaw, EditorState, Entity, RawDraftContentState } from 'draft-js'

const HtmlEditorNoSSRWrapper = dynamic(import('mui-rte'), {
  ssr: false,
  loading: () => <WarmupBox />,
})

const HtmlEditor = ({ value, onChanged }: { value: string; onChanged: (text: string) => void }) => {
  console.log('value: ', value)

  const [stringData, setStringData] = React.useState<string | null>(null)
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty())
  //const [rawEditorState, setRawEditorState] = React.useState<RawDraftContentState>({})

  //console.log(data)
  const save = (data: string) => {
    //const content = JSON.parse(data) as ContentState
    //const content = ContentState.createFromBlockArray(e.)
    //const raw = JSON.stringify(convertToRaw(content))
    const parsed = JSON.parse(data)
    // c
    //const raw = convertToRaw(content)
    // console.log('parsed ', parsed)
    const blocks = parsed['blocks'] as ContentBlock[]
    const entityMap = parsed['entityMap'] as Entity
    const content = ContentState.createFromText(data)
    //console.log('block:', blocks)
    //console.log('entityMap:', entityMap)
    console.log(content)
    onChanged(data)
  }
  const handleChange = (e: EditorState) => {
    setEditorState(e)
    //const content = EditorState.createWithContent
    //e.to
    //console.log(JSON.stringify(e))
    //let t = EditorState.createWithContent()
    //console.log()
  }
  const myTheme = createTheme({
    // Set up your custom MUI theme here
  })

  React.useEffect(() => {
    setStringData(value)
  }, [stringData])

  return (
    <ThemeProvider theme={myTheme}>
      <HtmlEditorNoSSRWrapper label='type something' defaultValue={value} onSave={save} onChange={handleChange} />
    </ThemeProvider>
  )
}

export default HtmlEditor

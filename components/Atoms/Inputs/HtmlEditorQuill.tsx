import React from 'react'
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
import WarmupBox from 'components/Atoms/WarmupBox'
import BackdropLoader from '../Loaders/BackdropLoader'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <BackdropLoader />,
})

const HtmlEditorQuill = ({ value, onChanged }: { value: string; onChanged: (text: string) => void }) => {
  return <QuillNoSSRWrapper style={{ height: 400, width: '100%' }} defaultValue={value} value={value} onChange={(e) => onChanged(e)} />
}

export default HtmlEditorQuill

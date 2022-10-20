import React from 'react'
import 'react-quill/dist/quill.snow.css'
import dynamic from 'next/dynamic'
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
})

const HtmlEditor = ({ value, onChanged }: { value: string; onChanged: (text: string) => void }) => {
  return <QuillNoSSRWrapper style={{ height: 200, width: '100%' }} defaultValue={value} value={value} onChange={(e) => onChanged(e)} />
}

export default HtmlEditor

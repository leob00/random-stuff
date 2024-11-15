import React from 'react'
import 'react-quill-new/dist/quill.snow.css'
import dynamic from 'next/dynamic'

const HtmlEditorQuill = ({ value, onChanged }: { value: string; onChanged: (text: string) => void }) => {
  const QuillNoSSRWrapper = React.useMemo(() => dynamic(() => import('react-quill-new'), { ssr: false }), [])
  return (
    <>
      <QuillNoSSRWrapper style={{ height: 400, width: '100%' }} defaultValue={value} value={value} onChange={(e) => onChanged(e)} />
    </>
  )
}

export default HtmlEditorQuill
